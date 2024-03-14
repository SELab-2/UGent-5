from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
import enum
from src.database import Base


class Status(enum.Enum):
    InProgress = 1,
    Accepted = 2,
    Denied = 3


class Submission(Base):
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime] = mapped_column(default=datetime.now(),
                                           nullable=False)
    status: Mapped[Status] = mapped_column(default=Status.InProgress, nullable=False)

    group_id: Mapped[int] = mapped_column(
        ForeignKey("team.id", ondelete="CASCADE"),
        nullable=False
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE"),
        nullable=False
    )
