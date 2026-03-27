from typing import Optional, List
from sqlmodel import SQLModel, Relationship, Field, Column, DateTime, func
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, constr
import uuid

# --- DATABASE MODELS ---

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
    students: List["Student"] = Relationship(back_populates="school")

class ClassRoom(SQLModel, table=True): 
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    school_id: int = Field(foreign_key="school.id")
    students: List["Student"] = Relationship(back_populates="classroom")

class Student(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    name: str
    grade: str
    student_id: str = Field(unique=True) 
    fee_amount: float
    payment_status: str = Field(default="Unpaid") 
    school_id: int = Field(foreign_key="school.id")
    classroom_id: Optional[int] = Field(default=None, foreign_key="classroom.id")

    school: Optional["School"] = Relationship(back_populates="students")
    payments: List["Payment"] = Relationship(back_populates="student")
    #quotes around "ClassRoom" to prevent name error
    classroom: Optional["ClassRoom"] = Relationship(back_populates="students")

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
    student: Optional["Student"] = Relationship(back_populates="payments")

# --- SCHEMAS FOR API INPUTS (Pydantic) ---

class SchoolCreate(SQLModel):
    name: str
    email: str
    password: str
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    bank_code: Optional[str] = None


class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=8, max_length=72)] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    bank_code: Optional[str] = None

class ClassRoomCreate(BaseModel):
    name: str

class StudentCreate(BaseModel):
    name: str
    grade: str
    student_id: str
    fee_amount: float
    classroom_id: Optional[int] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[str] = None
    student_id: Optional[str] = None
    fee_amount: Optional[float] = None
    payment_status: Optional[str] = None
    classroom_id: Optional[int] = None