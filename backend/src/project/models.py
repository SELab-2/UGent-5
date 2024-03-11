from datetime import date
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, Mapped
from src.database import Base


class Project(Base):
    __tablename__ = 'project'

    id: Mapped[int] = Column(BigInteger, primary_key=True, autoincrement=True)  # type: ignore
    deadline: Mapped[date] = Column(Date, nullable=False)  # type: ignore
    name: Mapped[str] = Column(String, nullable=False)  # type: ignore
    subject_id: Mapped[int] = Column(BigInteger, ForeignKey('subject.id', ondelete="SET NULL"),nullable=True)  # type: ignore
    description: Mapped[str] = Column(String, nullable=True)  # type: ignore
    enroll_deadline: Mapped[date] = Column(Date, nullable=True)

    # Relationships
    subject = relationship("Subject")

    __table_args__ = (
        CheckConstraint('deadline >= CURRENT_DATE', name='deadline_check'),
    )
