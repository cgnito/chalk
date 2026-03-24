import re
from sqlmodel import Session, select
from sqlalchemy import func
from typing import Optional

from app.models import Student, School, SchoolCreate, Payment, StudentCreate
from app.security import hash_password

# --- HELPER FOR SLUGS ---
def slugify(text: str) -> str:
    """Converts 'Royal Academy' to 'royal-academy'"""
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

# --- SCHOOL CRUD ---

def create_school(session: Session, school_in: SchoolCreate):
    hashed_pwd = hash_password(school_in.password)
    
    #auto-generate slug from school
    final_slug = slugify(school_in.name)

    db_school = School(
        name=school_in.name,
        email=school_in.email,
        slug=final_slug,
        hashed_password=hashed_pwd,
        
        bank_name=school_in.bank_name,
        account_number=school_in.account_number,
        bank_code=school_in.bank_code
    )

    session.add(db_school)
    session.commit()
    session.refresh(db_school)
    return db_school

def get_school_by_email(session: Session, email: str):
    statement = select(School).where(School.email == email)
    return session.exec(statement).first()

def get_school_by_slug(session: Session, slug: str):
    """Crucial for the Parent Search page!"""
    statement = select(School).where(School.slug == slug)
    return session.exec(statement).first()

# --- STUDENT CRUD ---

def create_student(session: Session, student_in: StudentCreate, school_id: int):
    db_student = Student(
        **student_in.model_dump(), 
        school_id=school_id 
    )
    session.add(db_student)
    session.commit()
    session.refresh(db_student) 
    return db_student

def get_student_by_id(session: Session, student_db_id: int):
    return session.get(Student, student_db_id)

def get_student_by_sid(session: Session, student_id: str):
    statement = select(Student).where(Student.student_id == student_id)
    return session.exec(statement).first()

def get_students_by_school(session: Session, school_id: int):
    statement = select(Student).where(Student.school_id == school_id)
    return session.exec(statement).all()

def update_student(session: Session, id: int, update_data: dict):
    db_student = session.get(Student, id)
    if not db_student:
        return None
    for key, value in update_data.items():
        setattr(db_student, key, value)   
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    return db_student

def delete_student(session: Session, id: int):
    student = session.get(Student, id)
    if student:
        session.delete(student)
        session.commit()
        return True
    return False

# --- PAYMENT CRUD ---

def create_payment(session: Session, student_id: int, school_id: int, amount: float, email: Optional[str] = None):
    db_payment = Payment(
        student_pk_id=student_id,
        school_id=school_id,
        amount=amount,
        status="pending",
        payer_email=email
    )
    session.add(db_payment)
    session.commit()
    session.refresh(db_payment)
    return db_payment

def get_total_paid_by_student(session: Session, student_pk_id: int) -> float:
    statement = (
        select(func.sum(Payment.amount))
        .where(Payment.student_pk_id == student_pk_id)
        .where(Payment.status == "success")
    )
    result = session.exec(statement).first()
    return result if result is not None else 0.0