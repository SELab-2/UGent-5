from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.project.service import get_teachers_by_project
from src.submission.dependencies import user_permission_validation, get_group_id
from src.user.dependencies import admin_user_validation, get_authenticated_user
from .schemas import Submission, SubmissionCreate
from src.user.schemas import User
from . import service

router = APIRouter(
    prefix="/api/submissions",
    tags=["submission"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[Submission])
async def get_submissions(group_id: int | None = None,
                          project_id: int | None = None,
                          user: User = Depends(get_authenticated_user),
                          db: AsyncSession = Depends(get_async_db)):
    if group_id is not None:
        raise NotAuthorized() #TODO: waiting for group
    elif project_id is not None:
        teachers = await get_teachers_by_project(db,project_id)
        if not any(user.uid == teacher.uid for teacher in teachers):
            raise NotAuthorized()

        return await service.get_submissions_by_project(db,project_id)
    else:
        if not user.is_admin:
            raise NotAuthorized()

        return await service.get_submissions(db)


@router.get("/{submission_id}", response_model=list[Submission],
            dependencies=[Depends(user_permission_validation)])
async def get_submission(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    return await service.get_submission(db, submission_id)


@router.post("/", response_model=Submission, status_code=201,
                  dependencies=[Depends(user_permission_validation)])
async def create_submission(submission: SubmissionCreate,
                            db: AsyncSession = Depends(get_async_db),
                            group_id: int = Depends(get_group_id)):
    return await service.create_submission(db, submission, group_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)
    return "Successfully deleted"
