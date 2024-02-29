from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import admin_user_validation

from . import service
from .dependencies import get_subject
from .schemas import Subject, SubjectCreate

router = APIRouter(
    prefix="/subject",
    tags=["subject"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[Subject])
async def get_subjects():
    pass


@router.get("/{subject_id}", response_model=Subject)
async def get_subject(subject: Subject = Depends(get_subject)):
    return subject


@router.post("/", response_model=Subject, dependencies=[Depends(admin_user_validation)], status_code=201)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    return await service.create_subject(db, subject)


@router.delete("/{subject_id}", dependencies=[Depends(admin_user_validation)], status_code=200)
async def delete_subject(subject: Subject = Depends(get_subject), db: Session = Depends(get_db)):
    await service.remove_subject(db, subject)
    return "Successfully deleted"
