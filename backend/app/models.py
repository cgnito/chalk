from typing import Optional, List
from sqlmodel import SQLModel, Relationship, Field, Column, DateTime, func
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr
import uuid


class School(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    name: str 
    email: EmailStr = Field(unique=True)
    slug: str = Field(unique=True, index=True)
    hashed_password: str = Field(exclude=True)
    created_at: Optional[datetime] = Field(
        default=None, 
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    bank_name: Optional[str] = None
    account_number: Optional[str] = Field(default=None, max_length=10)
    bank_code: Optional[str] = None

    #relationship (one-to-many, school to student relationship. a school acan ave many students)
    students: List["Student"] = Relationship(back_populates="school")



class Student(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    name: str
    grade: str
    student_id: str = Field(unique=True) 
    fee_amount: float
    payment_status: str = Field(default="Unpaid") 
    school_id: int = Field(foreign_key="school.id")

    #relationship
    school: Optional["School"] = Relationship(back_populates="students")
    payments: List["Payment"] = Relationship(back_populates="student")


class Payment(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    student_pk_id: int = Field(foreign_key="student.id")
    school_id: int = Field(foreign_key="school.id")
    amount: float
    status: str = Field(default="pending") 
    payer_email: Optional[EmailStr] = None
    reference: str = Field(default_factory=lambda: f"SP-{uuid.uuid4().hex[:8].upper()}", index=True)
    created_at: Optional[datetime] = Field(
        default=None, 
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    #relationship
    student: Optional["Student"] = Relationship(back_populates="payments")


# --- SCHEMAS FOR API INPUTS ---

class SchoolCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    bank_name: Optional[str] = None
    account_number: Optional[str] = Field(default=None, max_length=10)
    bank_code: Optional[str] = None # e.g., '057' for Zenith

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    bank_code: Optional[str] = None


class StudentCreate(BaseModel):
    name: str
    grade: str
    student_id: str
    fee_amount: float
    

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[str] = None
    student_id: Optional[str] = None
    fee_amount: Optional[float] = None
    payment_status: Optional[str] = None  