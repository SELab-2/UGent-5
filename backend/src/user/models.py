from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import Set


class User(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(primary_key=True)
    uid: Mapped[str]
    given_name: Mapped[str]
    is_admin: Mapped[bool] = mapped_column(default=False)

    import src.subject.models as subject_models
    follows_subjects: Mapped[Set[subject_models.Subject]] = relationship(
        secondary=subject_models.StudentSubject, back_populates="students"
    )

    teaches_subjects: Mapped[Set[subject_models.Subject]] = relationship(
        secondary=subject_models.TeacherSubject, back_populates="teachers"
    )
