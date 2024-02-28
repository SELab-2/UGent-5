from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
import src.user.models as user_models
from typing import Set

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("student_id", ForeignKey("user.id")),
    Column("subject_id", ForeignKey("subject.id"))
)

TeacherSubject = Table(
    "teacher_subject",
    Base.metadata,
    Column("teacher_id", ForeignKey("user.id")),
    Column("subject_id", ForeignKey("subject.id"))
)

class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    students: Mapped[Set["User"]] = relationship(
        secondary=StudentSubject,back_populates="follows_subjects"
    )

    teachers: Mapped[Set["User"]] = relationship(
        secondary=TeacherSubject,back_populates="teaches_subjects"
    )
