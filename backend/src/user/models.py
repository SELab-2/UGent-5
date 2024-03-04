from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import Set
from src.subject.models import TeacherSubject


class User(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(primary_key=True)
    given_name: Mapped[str]
    is_admin: Mapped[bool] = mapped_column(default=False)
