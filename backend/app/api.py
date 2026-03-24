from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from jose import JWTError, jwt
from typing import List, Optional

from app.database import engine
from app import crud
from app import security
from app.models import Student, StudentUpdate, SchoolCreate, School, Payment, StudentCreate
from app import payment_service

router = APIRouter()

# to look for the "authorize" token at the /login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_session():
    with Session(engine) as session:
        yield session

# --- AUTH DEPENDENCY---
def get_current_school(
    token: str = Depends(oauth2_scheme), 
    session: Session = Depends(get_session)
) -> School:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    school = crud.get_school_by_email(session, email=email)
    if school is None:
        raise credentials_exception
    return school


# --- AUTH ROUTES ---

#register school
@router.post("/register/", response_model=School, status_code=status.HTTP_201_CREATED)
def register_school(school_in: SchoolCreate, session: Session = Depends(get_session)):
    existing_school = crud.get_school_by_email(session, school_in.email)
    if existing_school:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="School with this email already exists"
        )
    # crud.create_school handles the hashing using security.hash_password
    return crud.create_school(session, school_in)


#school login
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    school = crud.get_school_by_email(session, form_data.username)
    if not school or not security.verify_password(form_data.password, school.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    access_token = security.create_access_token(data={"sub": school.email})
    return {"access_token": access_token, "token_type": "bearer"}


# --- PROTECTED STUDENT ROUTES (admin Only) ---

#create a student
@router.post("/students/", response_model=Student)
def create_student(
    student_in: StudentCreate,
    session: Session = Depends(get_session),
    current_school: School = Depends(get_current_school) 
):
    #prove it is not none
    if current_school.id is None:
        raise HTTPException(status_code=400, detail="Invalid school session")
        
    return crud.create_student(session, student_in, current_school.id)


#get all students in a school
@router.get("/students/", response_model=List[Student])
def read_students(
    session: Session = Depends(get_session),
    current_school: School = Depends(get_current_school)
):
    if not current_school.id:
         raise HTTPException(status_code=500, detail="School ID error")
         
    return crud.get_students_by_school(session, current_school.id)


@router.patch("/students/{id}", response_model=Student) 
def update_student(
    id: int, 
    student_update: StudentUpdate, 
    session: Session = Depends(get_session),
    current_school: School = Depends(get_current_school)
):
    #check if student exists AND belongs to this school
    db_student = crud.get_student_by_id(session, id)
    if not db_student or db_student.school_id != current_school.id:
        raise HTTPException(status_code=404, detail="Student not found or unauthorized")

    update_data = student_update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    
    return crud.update_student(session, id, update_data)


@router.delete("/student/{id}")
def delete_student(
    id: int, 
    session: Session = Depends(get_session),
    current_school: School = Depends(get_current_school)
):
    #verify before deleting
    db_student = crud.get_student_by_id(session, id)
    if not db_student or db_student.school_id != current_school.id:
        raise HTTPException(status_code=404, detail="Student not found or unauthorized")
        
    crud.delete_student(session, id)
    return {"message": "Student deleted successfully"}


# --- PUBLIC STUDENT ROUTE (For Parents) ---

#get student to pay for
@router.get("/public/{school_slug}/search/{student_id}", response_model=Student)
def public_student_search(
    school_slug: str, 
    student_id: str, 
    session: Session = Depends(get_session)
):
    #find the school by its unique slug
    school = crud.get_school_by_slug(session, school_slug)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    #find the student by their SID (e.g., STU-2-001)
    student = crud.get_student_by_sid(session, student_id)
    #check if this student actually belongs to THIS school
    if not student or student.school_id != school.id:
        raise HTTPException(status_code=404, detail="Student not found in this school")

    return student


#initiate payment
@router.post("/payments/initiate/{student_id}")
async def initiate_student_payment(
    student_id: str, 
    amount: float, 
    email: Optional[str] = None,
    session: Session = Depends(get_session)
):
    #verify student exists
    student = crud.get_student_by_sid(session, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    #create pending payment
    if student.id is None or student.school_id is None:
        raise HTTPException(status_code=500, detail="Database integrity error: Student ID missing")
    
    new_payment = crud.create_payment(
        session, 
        student_id=student.id, 
        school_id=student.school_id, 
        amount=amount
    )

    #call Interswitch 
    payment_url = await payment_service.get_payment_url(
        amount_naira=amount,
        reference=new_payment.reference,
        customer_email = email if email else "no-reply@chalk.com"
    )

    if not payment_url:
        raise HTTPException(status_code=502, detail="Interswitch service unavailable")

    return {"payment_url": payment_url, "reference": new_payment.reference}



#verify payments
@router.get("/payments/verify/{reference}")
async def verify_payment(
    reference: str, 
    session: Session = Depends(get_session)
):
    #get the payment record
    statement = select(Payment).where(Payment.reference == reference)
    payment = session.exec(statement).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    #if it's already successful, stop
    if payment.status == "success":
        return {"status": "success", "message": "This payment was already processed!"}

    #ask Interswitch if it's actually successful
    is_valid = await payment_service.verify_interswitch_payment(reference, payment.amount)

    if is_valid:
        payment.status = "success"
        session.add(payment)
        
        student = session.get(Student, payment.student_pk_id)
        if student and student.id is not None:
            total_paid = crud.get_total_paid_by_student(session, student.id)
            
            if total_paid >= student.fee_amount:
                student.payment_status = "Paid"
            elif total_paid > 0:
                student.payment_status = "Partial"
            else:
                student.payment_status = "Unpaid"
                
            session.add(student)
        
        session.add(payment)
        session.commit()
        return {"status": "success", "message": "Payment verified and student updated!"}
    
    return {"status": "failed", "message": "Interswitch could not verify this payment"}

