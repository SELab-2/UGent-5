from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, Mapped
from src.database import Base


class Project(Base):
    __tablename__ = 'project'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    deadline = Column(Date, nullable=False)
    name = Column(String, nullable=False)
    subject_id = Column(BigInteger, ForeignKey(
        'subject.id', ondelete="SET NULL"), nullable=True)  # Adjusted to BigInteger
    description = Column(String, nullable=True)
    enroll_deadline = Column(Date, nullable=True)

    # Relationships
    subject = relationship("Subject")

    __table_args__ = (
        CheckConstraint('deadline >= CURRENT_DATE', name='deadline_check'),
    )
