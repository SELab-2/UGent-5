from sqlalchemy import Column, ForeignKey, String, Table, Set
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from src.user.models import User

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("student_id", ForeignKey("student.id")),
    Column("subject_id", ForeignKey("subject.id"))
)

TeacherSubject = Table(
    "teacher_subject",
    Base.metadata,
    Column("teacher_id", ForeignKey("teacher.id")),
    Column("subject_id", ForeignKey("subject.id"))
)

class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String)

    students: Mapped[Set["User"]] = relationship(
        secondary=StudentSubject,back_populates="follows_subjects"
    )

    teachers: Mapped[Set["User"]] = relationship(
        secondary=TeacherSubject,back_populates="teaches_subjects"
    )
