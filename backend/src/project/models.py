from datetime import date
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, CheckConstraint, Integer
from sqlalchemy.orm import relationship, Mapped
from src.database import Base

f


class Project(Base):
    __tablename__ = 'project'

    id = Column(BigInteger, primary_key=True)
    deadline = Column(Date, nullable=False)
    name = Column(String, nullable=False)
    subject_id = Column(BigInteger, ForeignKey('subject.id'), nullable=True)
    description = Column(String, nullable=True)
    subject = relationship("Subject")
    enroll_deadline: Mapped[date] = Column(Date, nullable=True)

    # Relationships
    subject = relationship("Subject")

    __table_args__ = (
        CheckConstraint('deadline >= CURRENT_DATE', name='deadline_check'),
    )
