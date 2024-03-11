from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from .schemas import Submission
from . import service
from src.user.dependencies import admin_user_validation, user_id_validation
from src.user.schemas import User

router = APIRouter(
    prefix="/api/submissions",
    tags=["subject"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[Submission])
async def get_submission(submission_id: int, db: Session = Depends(get_db)):
    return await service.get_submisstion(db,submission_id)

