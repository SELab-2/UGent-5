from typing import Set

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("student_id", ForeignKey("user.uid")),
    Column("subject_id", ForeignKey("subject.id")),
)

TeacherSubject = Table(
    "teacher_subject",
    Base.metadata,
    Column("teacher_id", ForeignKey("user.uid")),
    Column("subject_id", ForeignKey("subject.id")),
)


class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
