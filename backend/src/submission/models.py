from sqlalchemy import BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
import datetime
import enum
from src.database import Base


class Status(enum.Enum):
    InProgress = 1,
    Accepted = 2,
    Denied = 3


class Submission(Base):
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[DateTime] = mapped_column(default=datetime.datetime.now(datetime.UTC),
                                           nullable=False)
    status: Mapped[Status] = mapped_column(default=Status.InProgress, nullable=False)

    group_id: Mapped[BigInteger] = mapped_column(
        ForeignKey("group.id", ondelete="CASCADE"),
        nullable=False
    )

    project_id: Mapped[BigInteger] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE"),
        nullable=False
    )
