from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import admin_user_validation
from src.user.schemas import User
from typing import List

from . import service
from .dependencies import get_subject, user_permission_validation, get_subjects
from .schemas import Subject, SubjectCreate

router = APIRouter(
    prefix="/subject",
    tags=["subject"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[Subject])
async def get_subjects(subjects: list[Subject] = Depends(get_subjects)):
    return subjects

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

@router.patch("/{subject_id}", response_model=Subject, dependencies=[Depends(user_permission_validation)])
async def update_subject(subject_update: SubjectCreate, subject_original: Subject = Depends(get_subject)) -> Subject:
    update_data = subject_update.model_dump(exclude_unset=True)
    subject_updated = subject_original.model_copy(update=update_data)
    return subject_updated

@router.get("/{subject_id}/teachers", response_model=List[User])
async def get_subject_teachers(subject_id: int, db: Session = Depends(get_db)):
    return await service.get_subject_teachers(db,subject_id)

@router.post("/{subject_id}/teachers", response_model=List[User])
async def create_subject_teacher():
    pass

@router.delete("/{subject_id}/teachers", response_model=List[User])
async def delete_subject_teacher():
    pass
