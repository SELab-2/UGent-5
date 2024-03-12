from datetime import datetime
from sqlalchemy import BigInteger, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base


class Project(Base):
    __tablename__ = 'project'

    id: Mapped[int] = mapped_column(primary_key=True)
    deadline: Mapped[datetime] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey(
        'subject.id', ondelete="CASCADE"), nullable=True)
    description: Mapped[str] = mapped_column(nullable=True)

    enroll_deadline: Mapped[datetime] = mapped_column(nullable=True)

    __table_args__ = (
        CheckConstraint('deadline >= CURRENT_DATE', name='deadline_check'),
    )
