from sqlalchemy import Column, ForeignKey, Table,ForeignKeyConstraint,Integer,event, select, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import List
from src.user.models import User

# TODO: set right primary keys
StudentGroup = Table(
    "student_group",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid", ondelete="CASCADE")),
    Column("team_id", ForeignKey("team.id", ondelete="CASCADE")),
)


class Group(Base):
    __tablename__ = "team"

    id: Mapped[int] = mapped_column(primary_key=True)
    num: Mapped[int] = mapped_column(nullable=False)
    score: Mapped[int] = mapped_column(nullable=False)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE"), nullable=False
    )
    members: Mapped[List["User"]] = relationship(secondary=StudentGroup, lazy="joined")

@event.listens_for(Group,"before_insert")
def set_id(_,connect,target: Group):
    query = select(func.max(Group.num)).where(Group.project_id == target.project_id)
    max_id = connect.execute(query).scalar()
    target.num = (max_id or 0) + 1
