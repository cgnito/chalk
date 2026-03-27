import os
import re
import time
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app import crud, security, payment_service
from app.database import engine
from app.models import (
    Student, 
    StudentCreate,
    StudentUpdate, 
    School, 
    SchoolCreate, 
    SchoolUpdate, 
    Payment, 
    ClassRoom,
    ClassRoomCreate
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- DEPENDENCIES ---

def get_session():
    with Session(engine) as session:
        yield session

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

@router.post("/register/", response_model=School, status_code=status.HTTP_201_CREATED)
def register_school(school_in: SchoolCreate, session: Session = Depends(get_session)):
    existing_school = crud.get_school_by_email(session, school_in.email)
    if existing_school:
        raise HTTPException(status_code=400, detail="School with this email already exists")
    return crud.create_school(session, school_in)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    school = crud.get_school_by_email(session, form_data.username)
    if not school or not security.verify_password(form_data.password, school.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = security.create_access_token(data={"sub": school.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "school": {"name": school.name, "slug": school.slug, "email": school.email}
    }

# --- STUDENT ROUTES ---

@router.post("/students/", response_model=Student)
def create_student(student_in: StudentCreate, session: Session = Depends(get_session), current_school: School = Depends(get_current_school)):
    return crud.create_student(session, student_in, current_school.id)

@router.get("/students/", response_model=List[Student])
def read_students(session: Session = Depends(get_session), current_school: School = Depends(get_current_school)):
    return crud.get_students_by_school(session, current_school.id)

@router.delete("/student/{id}")
def delete_student(id: int, session: Session = Depends(get_session), current_school: School = Depends(get_current_school)):
    db_student = crud.get_student_by_id(session, id)
    if not db_student or db_student.school_id != current_school.id:
        raise HTTPException(status_code=404, detail="Student not found")
    crud.delete_student(session, id)
    return {"message": "Deleted"}

# --- CLASSROOM ROUTES ---

@router.post("/classes/", response_model=ClassRoom)
def create_class(class_in: ClassRoomCreate, session: Session = Depends(get_session), school: School = Depends(get_current_school)):
    return crud.create_class(session, class_in.name, school.id)

@router.get("/classes/", response_model=List[ClassRoom])
def list_classes(session: Session = Depends(get_session), school: School = Depends(get_current_school)):
    return crud.get_school_classes(session, school.id)

# --- PAYMENTS ---

@router.get("/payments/history/", response_model=List[Payment])
def get_payment_history(session: Session = Depends(get_session), school: School = Depends(get_current_school)):
    statement = select(Payment).where(Payment.school_id == school.id)
    return session.exec(statement).all()

@router.post("/payments/initiate/{external_student_id}")
async def initiate_payment(
    external_student_id: str,
    payload: dict = Body(...),
    session: Session = Depends(get_session),
):
    """external_student_id is the school's string student_id (e.g. STU-001), not the DB primary key."""
    clean_sid = external_student_id.strip()
    student = session.exec(
        select(Student).where(
            func.lower(func.trim(Student.student_id)) == clean_sid.lower()
        )
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student {clean_sid} not found",
        )

    try:
        amount = float(payload.get("amount"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Valid amount is required")

    email = payload.get("email")
    txn_ref = (payload.get("txn_ref") or "").strip()

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Valid amount is required")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if not txn_ref:
        raise HTTPException(status_code=400, detail="txn_ref is required")
    if len(txn_ref) > 15:
        raise HTTPException(
            status_code=400,
            detail="txn_ref must be at most 15 characters (Interswitch limit)",
        )
    if not re.fullmatch(r"[A-Za-z0-9]+", txn_ref):
        raise HTTPException(
            status_code=400,
            detail="txn_ref must be alphanumeric only",
        )

    amount_kobo = int(round(amount * 100))
    if amount_kobo < 1:
        raise HTTPException(status_code=400, detail="Amount too small for payment gateway")

    try:
        crud.create_payment(
            session=session,
            student_pk_id=student.id,
            school_id=student.school_id,
            amount=amount,
            reference=txn_ref,
            email=email,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to record transaction")

    return {
        "status": "success",
        "txn_ref": txn_ref,
        "amount_kobo": amount_kobo,
    }

@router.get("/payments/verify/{txn_ref}")
async def verify_payment(txn_ref: str, session: Session = Depends(get_session)):
    payment_rec = session.exec(select(Payment).where(Payment.reference == txn_ref)).first()
    if not payment_rec:
        raise HTTPException(status_code=404, detail="Payment reference not found")

    is_valid = await payment_service.verify_interswitch_payment(txn_ref, payment_rec.amount)

    if is_valid:
        payment_rec.status = "success"
        student = session.get(Student, payment_rec.student_pk_id)
        if student:
            student.payment_status = "Paid"
            session.add(student)

        session.add(payment_rec)
        session.commit()
        return {"status": "approved", "message": "Payment confirmed"}

    payment_rec.status = "failed"
    session.add(payment_rec)
    session.commit()

    return {"status": "failed", "message": "Payment verification failed"}

# --- SETTINGS ---

@router.get("/schools/me/settings/", response_model=School)
def get_settings(current_school: School = Depends(get_current_school)):
    return current_school

# --- PUBLIC ROUTES ---

@router.get("/public/{slug}/search/{sid}")
def search_student_public(slug: str, sid: str, session: Session = Depends(get_session)):
    school = session.exec(select(School).where(School.slug == slug)).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    statement = (
        select(Student)
        .where(
            func.lower(func.trim(Student.student_id)) == sid.strip().lower(), 
            Student.school_id == school.id
        )
        .options(selectinload(Student.classroom))
    )
    student = session.exec(statement).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    total_paid = crud.get_total_paid_by_student(session, student.id)

    return {
        "id": student.id,
        "name": student.name,
        "student_id": student.student_id,
        "grade": student.classroom.name if student.classroom else student.grade,
        "fee_amount": student.fee_amount,
        "total_paid": total_paid,
        "payment_status": student.payment_status
    }