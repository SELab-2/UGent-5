from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

# TODO: set right primary keys
StudentGroup = Table(
    "student_group",
    Base.metadata,
    Column("uid", ForeignKey("website_user.uid")),
    Column("team_id", ForeignKey("team.id")),
)


class Group(Base):
    __tablename__ = "team"

    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(nullable=False)
    score: Mapped[int] = mapped_column(nullable=False)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE"), nullable=False
    )
