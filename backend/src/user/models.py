from sqlalchemy import Column, ForeignKey, String, Table, Set
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from src.subject.router import StudentSubject,TeacherSubject, Subject

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String)

    follows_subjects: Mapped[Set["Subject"]] = relationship(
        secondary=StudentSubject,back_populates="subjects"
    )

    teaches_subjects: Mapped[Set["Subject"]] = relationship(
        secondary=TeacherSubject,back_populates="subjects"
    )
