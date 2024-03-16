from typing import Sequence
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_group
from src.submission.dependencies import create_permission_validation, retrieve_submission
from src.user.dependencies import admin_user_validation
from .schemas import Submission, SubmissionCreate
from . import service

router = APIRouter(
    prefix="/api/submissions",
    tags=["submission"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", dependencies=[Depends(admin_user_validation)])
async def get_submissions(db: AsyncSession = Depends(get_async_db)) -> Sequence[Submission]:
    return await service.get_submissions(db)


@router.get("/{submission_id}")
async def get_submission(submission: Submission = Depends(retrieve_submission)) -> Submission:
    return submission


@router.post("/", response_model=Submission, status_code=201,
             dependencies=[Depends(create_permission_validation)])
async def create_submission(submission: SubmissionCreate,
                            db: AsyncSession = Depends(get_async_db)):
    group = await retrieve_group(submission.group_id, db)
    return await service.create_submission(db, submission, submission.group_id, group.project_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)
