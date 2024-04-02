from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

StudentSubject = Table(
    "student_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid")),
    Column("subject_id", ForeignKey("subject.id")),
)

TeacherSubject = Table(
    "teacher_subject",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid",  ondelete="CASCADE")),
    Column("subject_id", ForeignKey("subject.id", ondelete="CASCADE")),
)


class Subject(Base):
    __tablename__ = "subject"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
