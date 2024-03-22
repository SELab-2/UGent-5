from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid")),
    Column("subject_id", ForeignKey("subject.id")),
)

InstructorSubject = Table(
    "instructor_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid")),
    Column("subject_id", ForeignKey("subject.id")),
)


class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
