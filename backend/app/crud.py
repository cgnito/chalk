import re
import uuid 
from typing import Optional, List
from sqlmodel import Session, select
from sqlalchemy import func

from app.models import Student, School, SchoolCreate, Payment, StudentCreate, ClassRoom
from app.security import hash_password

# --- HELPERS ---
def slugify(text: str) -> str:
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

def create_unique_slug(school_name: str) -> str:
    base_slug = slugify(school_name)
    random_suffix = uuid.uuid4().hex[:4] 
    return f"{base_slug}-{random_suffix}"

# --- SCHOOL CRUD ---
def create_school(session: Session, school_in: SchoolCreate):
    hashed_pwd = hash_password(school_in.password)
    slug = create_unique_slug(school_in.name)
    while get_school_by_slug(session, slug):
        slug = create_unique_slug(school_in.name)
        
    db_school = School(
        name=school_in.name,
        email=school_in.email,
        hashed_password=hashed_pwd,     
        bank_name=school_in.bank_name,
        account_number=school_in.account_number,
        bank_code=school_in.bank_code,
        slug=slug
    )
    session.add(db_school)
    session.commit()
    session.refresh(db_school)
    return db_school

def get_school_by_email(session: Session, email: str):
    return session.exec(select(School).where(School.email == email)).first()

def get_school_by_slug(session: Session, slug: str):
    return session.exec(select(School).where(School.slug == slug)).first()

# --- CLASSROOM CRUD ---
def get_school_classes(session: Session, school_id: int):
    return session.exec(select(ClassRoom).where(ClassRoom.school_id == school_id)).all()

def get_class_by_id(session: Session, class_id: int):
    return session.get(ClassRoom, class_id)

def create_class(session: Session, name: str, school_id: int):
    db_class = ClassRoom(name=name, school_id=school_id)
    session.add(db_class)
    session.commit()
    session.refresh(db_class)
    return db_class

def delete_class(session: Session, class_id: int):
    db_class = session.get(ClassRoom, class_id)
    if db_class:
        session.delete(db_class)
        session.commit()
        return True
    return False

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
    return session.exec(
        select(Student).where(
            func.lower(func.trim(Student.student_id)) == student_id.strip().lower()
        )
    ).first()

def get_students_by_school(session: Session, school_id: int):
    return session.exec(select(Student).where(Student.school_id == school_id)).all()

def update_student(session: Session, id: int, update_data: dict):
    db_student = session.get(Student, id)
    if not db_student: return None
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
def create_payment(
    session: Session,
    student_pk_id: int,
    school_id: int,
    amount: float,
    reference: str,
    email: Optional[str] = None,
):
    db_payment = Payment(
        student_pk_id=student_pk_id,
        school_id=school_id,
        amount=amount,
        status="pending",
        payer_email=email,
        reference=reference
    )
    session.add(db_payment)
    session.commit()
    session.refresh(db_payment)
    return db_payment

def get_total_paid_by_student(session: Session, student_pk_id: int) -> float:
    statement = select(func.sum(Payment.amount)).where(Payment.student_pk_id == student_pk_id, Payment.status == "success")
    result = session.exec(statement).first()
    return result if result is not None else 0.0