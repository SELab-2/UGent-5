from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import List


class Project(Base):
    __tablename__ = "project"

    id: Mapped[int] = mapped_column(primary_key=True)
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False)
    publish_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.now()
    )
    name: Mapped[str] = mapped_column(nullable=False)
    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subject.id", ondelete="CASCADE"), nullable=False
    )
    description: Mapped[str] = mapped_column(nullable=True)
    is_visible: Mapped[bool] = mapped_column(nullable=False)
    capacity: Mapped[int] = mapped_column(nullable=False)
    enroll_deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    requirements: Mapped[List["Requirement"]] = relationship(
        back_populates="project", lazy="joined")

    __table_args__ = (
        CheckConstraint("deadline >= CURRENT_DATE", name="deadline_check"),
    )

InstructorProject = Table(
    "instructor_project",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid",  ondelete="CASCADE")),
    Column("project_id", ForeignKey("project.id", ondelete="CASCADE")),
)


class Requirement(Base):
    __tablename__ = "requirement"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey(
        "project.id", ondelete="CASCADE"), nullable=True)
    project: Mapped["Project"] = relationship(back_populates="requirements")

    # True for mandatory False for prohibited
    mandatory: Mapped[bool] = mapped_column(nullable=False)
    value: Mapped[str] = mapped_column(nullable=False)
