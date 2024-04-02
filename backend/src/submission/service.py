from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from . import models


async def get_submissions(db: AsyncSession) -> Sequence[models.Submission]:
    return (await db.execute(select(models.Submission))).scalars().all()


async def get_submissions_by_project(db: AsyncSession,
                                     project_id: int) -> Sequence[models.Submission]:

    return (await db.execute(select(models.Submission).
                             filter_by(project_id=project_id))).scalars().all()


async def get_submissions_by_group(db: AsyncSession,
                                   group_id: int) -> Sequence[models.Submission]:
    return (await db.execute(select(models.Submission).
                             filter_by(group_id=group_id))).scalars().all()


async def get_submission(db: AsyncSession, submission_id: int) -> models.Submission:
    return (await db.execute(select(models.Submission)
                             .filter_by(id=submission_id))).scalar_one_or_none()


async def create_submission(db: AsyncSession,
                            uuid: str,
                            group_id: int,
                            subject_id: int
                            ) -> models.Submission:
    db_submission = models.Submission(
        group_id=group_id, project_id=subject_id, files_uuid=uuid)
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    return db_submission


async def delete_submission(db: AsyncSession, submission_id: int):
    submission = (await db.execute(select(models.Submission).
                                   filter_by(id=submission_id))).scalar()
    await db.delete(submission)
    await db.commit()
