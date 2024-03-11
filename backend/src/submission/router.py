from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.submission.dependencies import user_permission_validation, get_group_id
from src.user.dependencies import admin_user_validation
from .schemas import Submission, SubmissionCreate
from . import service

router = APIRouter(
    prefix="/api/submissions",
    tags=["subject"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{submission_id}", response_model=list[Submission],
            dependencies=[Depends(user_permission_validation)])
async def get_submission(submission_id: int, db: Session = Depends(get_db)):
    return await service.get_submission(db, submission_id)


@router.post("/", response_model=Submission, status_code=201)
async def create_submission(submission: SubmissionCreate,
                            db: Session = Depends(get_db),
                            group_id: int = Depends(get_group_id)):
    return await service.create_submission(db, submission, group_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: Session):
    await service.delete_submission(db, submission_id)
    return "Successfully deleted"
