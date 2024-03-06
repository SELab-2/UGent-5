from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

class Group(Base):
    __tablename__ = "team"

    group_id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[str]
    max_students: Mapped[int] #TODO change to name database
    score: Mapped[int]
    project_id: Mapped[int]