from sqlalchemy import Column, BigInteger, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base


class Project(Base):
    __tablename__ = 'project'

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    deadline = Column(Date, nullable=False, check_constraint='deadline >= CURRENT_DATE')
    name = Column(String, nullable=False)
    subjectId = Column(String, ForeignKey(
        'Subject.subjectId', ondelete="SET NULL"), nullable=True)
    description = Column(String, nullable=True)

    # Relationships
    teams = relationship("Team", back_populates="project")
