from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import admin_user_validation, user_id_validation
from src.user.schemas import User

from . import service
from .dependencies import (
    retrieve_subject,
    retrieve_subjects,
    user_permission_validation,
)
from .schemas import Subject, SubjectCreate, SubjectList

router = APIRouter(
    prefix="/api/subject",
    tags=["subject"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=SubjectList)
async def get_subjects(subjects: SubjectList = Depends(retrieve_subjects)):
    return subjects


@router.get("/{subject_id}", response_model=Subject)
async def get_subject(subject: Subject = Depends(retrieve_subject)):
    return subject


@router.post(
    "/",
    response_model=Subject,
    dependencies=[Depends(admin_user_validation)],
    status_code=201,
)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    return await service.create_subject(db, subject)


@router.delete(
    "/{subject_id}", dependencies=[Depends(admin_user_validation)], status_code=200
)
async def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    await service.delete_subject(db, subject_id)
    return "Successfully deleted"


@router.patch(
    "/{subject_id}",
    response_model=Subject,
    dependencies=[Depends(user_permission_validation)],
)
async def update_subject(
    subject_update: SubjectCreate, subject_original: Subject = Depends(get_subject)
) -> Subject:
    update_data = subject_update.model_dump(exclude_unset=True)
    subject_updated = subject_original.model_copy(update=update_data)
    return subject_updated


# ---------------Teachers------------


@router.get("/{subject_id}/teachers", response_model=list[User])
async def get_subject_teachers(subject_id: int, db: Session = Depends(get_db)):
    return await service.get_teachers(db, subject_id)


@router.post(
    "/{subject_id}/teachers",
    dependencies=[Depends(user_permission_validation), Depends(user_id_validation)],
    status_code=201,
)
async def create_subject_teacher(
    subject_id: int, user_id: str, db: Session = Depends(get_db)
):
    await service.create_subject_teacher(db, subject_id, user_id)
    return "Successfully added"


@router.delete(
    "/{subject_id}/teachers/{user_id}",
    dependencies=[Depends(user_permission_validation)],
)
async def delete_subject_teacher(
    subject_id: int, user_id: str, db: Session = Depends(get_db)
):
    await service.delete_subject_teacher(db, subject_id, user_id)
