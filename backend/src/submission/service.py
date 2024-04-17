from typing import Sequence, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from . import models, schemas
from .exceptions import SubmissionNotFound
from .models import Status, ResultType


async def get_submissions(db: AsyncSession) -> Sequence[models.Submission]:
    return (await db.execute(select(models.Submission))).unique().scalars().all()


async def get_submissions_by_project(db: AsyncSession,
                                     project_id: int) -> Sequence[models.Submission]:

    return (await db.execute(select(models.Submission).
                             filter_by(project_id=project_id))).unique().scalars().all()


async def get_submissions_by_group(db: AsyncSession,
                                   group_id: int) -> Sequence[models.Submission]:
    return (await db.execute(select(models.Submission).
                             filter_by(group_id=group_id))).unique().scalars().all()


async def get_submission(db: AsyncSession, submission_id: int) -> models.Submission:
    return (await db.execute(select(models.Submission)
                             .filter_by(id=submission_id))).unique().scalar_one_or_none()


async def create_submission(db: AsyncSession,
                            uuid: str,
                            remarks: str | None,
                            status: Status,
                            group_id: int,
                            project_id: int
                            ) -> models.Submission:
    db_submission = models.Submission(
        group_id=group_id, remarks=remarks, status=status, project_id=project_id, files_uuid=uuid)
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    return db_submission


async def delete_submission(db: AsyncSession, submission_id: int):
    submission = (await db.execute(select(models.Submission).
                                   filter_by(id=submission_id))).scalar()
    await db.delete(submission)
    await db.commit()


async def update_submission_status(
    db: AsyncSession, submission_id: int, status: Status, test_results: List[schemas.TestResult]
) -> models.Submission:
    result = await db.execute(select(models.Submission).filter_by(id=submission_id))
    submission = result.scalars().first()
    if not submission:
        raise SubmissionNotFound()

    submission.status = status

    for testresult in test_results:
        await create_testresult(db, submission_id, testresult.type, testresult.value)

    await db.commit()
    await db.refresh(submission)
    return submission


async def create_testresult(
    db: AsyncSession, submission_id: int, result_type: ResultType, value: str
) -> models.TestResult:
    db_testresult = models.TestResult(
        submission_id=submission_id, type=result_type, value=value)
    db.add(db_testresult)
    await db.commit()
    await db.refresh(db_testresult)
    return db_testresult
