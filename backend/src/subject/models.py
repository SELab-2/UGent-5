from datetime import datetime
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base
from uuid import uuid4

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id"), primary_key=True),
)

InstructorSubject = Table(
    "instructor_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid",  ondelete="CASCADE"), primary_key=True),
    Column("subject_id", ForeignKey("subject.id", ondelete="CASCADE"), primary_key=True),
)


class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    academic_year: Mapped[int] = mapped_column(nullable=False, default=datetime.now().year)
    uuid: Mapped[str] = mapped_column(default=str(uuid4()))
    name: Mapped[str]
