from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import List

class Project(Base):
    __tablename__ = "project"

    id: Mapped[int] = mapped_column(primary_key=True)
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subject.id", ondelete="CASCADE"), nullable=True
    )
    description: Mapped[str] = mapped_column(nullable=True)
    enroll_deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    requirements: Mapped[List["Requirement"]] = relationship(back_populates="project",lazy="joined")

    __table_args__ = (
        CheckConstraint("deadline >= CURRENT_DATE", name="deadline_check"),
    )

class Requirement(Base):
    __tablename__ = "requirement"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("project.id", ondelete="CASCADE"), nullable=True)
    project: Mapped["Project"] = relationship(back_populates="requirements")

    mandatory: Mapped[bool] = mapped_column(nullable=False) # True for mandatory False for prohibited
    value: Mapped[str] = mapped_column(nullable=False)
