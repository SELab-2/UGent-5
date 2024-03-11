from datetime import date
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, Mapped
from src.database import Base

from backend.src.subject.models import Subject


class Project(Base):
    __tablename__ = 'project'

    id = Column(Integer, primary_key=True)  # type: Mapped[int]
    deadline = Column(Date, nullable=False)  # type: Mapped[date]
    name = Column(String, nullable=False)  # type: Mapped[str]
    subject_id = Column(Integer, ForeignKey('subject.id'),
                        nullable=True)  # type: Mapped[int]
    description = Column(String, nullable=True)  # type: Mapped[str]
    subject = relationship("Subject")  # type: Mapped[Subject]
    enroll_deadline: Mapped[date] = Column(
        Date, nullable=True)  # type: Mapped[date]

    # Relationships
    subject = relationship("Subject")  # type: Mapped[Subject]

    __table_args__ = (
        CheckConstraint('deadline >= CURRENT_DATE', name='deadline_check'),
    )
