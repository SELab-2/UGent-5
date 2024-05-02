from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from src.database import Base


class Status(enum.IntEnum):
    InProgress = 1
    Accepted = 2
    Rejected = 3
    Crashed = 4


class Submission(Base):
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime] = mapped_column(default=datetime.now(),
                                           nullable=False)
    status: Mapped[Status] = mapped_column(default=Status.InProgress, nullable=False)
    remarks: Mapped[str] = mapped_column(nullable=True)
    files_uuid: Mapped[str] = mapped_column(nullable=False)

    group_id: Mapped[int] = mapped_column(
        ForeignKey("team.id", ondelete="CASCADE"),
        nullable=False
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE"),
        nullable=False
    )

    stdout: Mapped[str] = mapped_column(nullable=True)
    stderr: Mapped[str] = mapped_column(nullable=True)

    # Without passive_deletes="all", sqlalchemy will for some reason try to set submission_id of TestResult to NULL,
    # causing a violation error of not_null-constraint.
    # see https://docs.sqlalchemy.org/en/20/orm/relationship_api.html#sqlalchemy.orm.relationship.params.passive_deletes
    testresults: Mapped[List["TestResult"]] = relationship(
        back_populates="submission", lazy="joined", passive_deletes="all"
    )


class TestResult(Base):
    __tablename__ = "testresult"

    id: Mapped[int] = mapped_column(primary_key=True)
    submission_id: Mapped[int] = mapped_column(
        ForeignKey("submission.id", ondelete="CASCADE"),
        nullable=False
    )
    submission: Mapped["Submission"] = relationship(back_populates="testresults")

    succeeded: Mapped[bool] = mapped_column(nullable=False)
    value: Mapped[str] = mapped_column(nullable=False)
