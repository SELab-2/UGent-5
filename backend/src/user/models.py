from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
import src.subject.models as subj_models
from typing import Set

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    follows_subjects: Mapped[Set["Subject"]] = relationship(
        secondary=subj_models.StudentSubject,back_populates="students"
    )

    teaches_subjects: Mapped[Set["Subject"]] = relationship(
        secondary=subj_models.TeacherSubject,back_populates="teachers"
    )
