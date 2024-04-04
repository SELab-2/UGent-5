from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.project.schemas import ProjectList
from src.project.service import get_projects_for_subject
from src.user.dependencies import get_authenticated_user, teacher_or_admin_user_validation
from src.user.schemas import User

from . import service
from .dependencies import (
    retrieve_subject,
    retrieve_subject_by_uuid,
    retrieve_subjects,
    add_student_permission_validation,
    retrieve_uuid, teacher_permission_validation,
)
from .schemas import Subject, SubjectCreate, SubjectList

router = APIRouter(
    prefix="/api/subjects",
    tags=["subjects"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.get("/", response_model=SubjectList)
async def get_subjects(subjects: SubjectList = Depends(retrieve_subjects)):
    return subjects


@router.get("/{subject_id}", response_model=Subject)
async def get_subject(subject: Subject = Depends(retrieve_subject)):
    return subject

@router.get("/{subject_id}/uuid", dependencies=[Depends(teacher_or_admin_user_validation)])
async def get_subject_uuid(uuid: str = Depends(retrieve_uuid)):
    return {"subject_uuid": uuid}

@router.post(
    "/",
    response_model=Subject,
    dependencies=[Depends(teacher_or_admin_user_validation)],
    status_code=201,
)
async def create_subject(
    subject: SubjectCreate, db: AsyncSession = Depends(get_async_db)
):
    return await service.create_subject(db, subject)


@router.delete(
    "/{subject_id}", dependencies=[Depends(teacher_or_admin_user_validation)], status_code=200
)
async def delete_subject(subject_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_subject(db, subject_id)


@router.patch(
    "/{subject_id}",
    response_model=Subject,
    dependencies=[Depends(teacher_or_admin_user_validation)],
)
async def update_subject(
    subject_update: SubjectCreate,
    subject_original: Subject = Depends(retrieve_subject),
    db: AsyncSession = Depends(get_async_db)
) -> Subject:
    update_data = subject_update.model_dump(exclude_unset=True)
    subject_updated = subject_original.model_copy(update=update_data)
    return await service.update_subject(db,subject_updated)


# ---------------Teachers------------


@router.get("/{subject_id}/instructors", response_model=list[User])
async def get_subject_instructors(
    subject_id: int, db: AsyncSession = Depends(get_async_db)
):
    return await service.get_instructors(db, subject_id)


@router.post(
    "/{subject_id}/instructors",
    dependencies=[Depends(teacher_permission_validation)],
    status_code=201,
)
async def create_subject_instructor(
    subject_id: int, instructor_uid: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_async_db)
):
    await service.add_instructor_to_subject(db, subject_id, instructor_uid)


@router.delete(
    "/{subject_id}/instructors/{user_id}",
    dependencies=[Depends(teacher_or_admin_user_validation)],
)
async def delete_subject_instructor(
    subject_id: int, user_id: str, db: AsyncSession = Depends(get_async_db)
):
    await service.delete_subject_instructor(db, subject_id, user_id)


# ---------------Students------------

@router.get("/{subject_id}/students", response_model=list[User])
async def get_subject_students(
    subject_id: int, db: AsyncSession = Depends(get_async_db)
):
    return await service.get_students(db, subject_id)


@router.post(
    "/{subject_id}/students",
    dependencies=[Depends(add_student_permission_validation)],
    status_code=201,
)
async def add_student_to_subject(
    subject: Subject = Depends(retrieve_subject),
    student_uid: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_async_db)
) -> Subject:
    await service.create_subject_student(db, subject.id, student_uid)
    return subject

@router.post(
    "/join",
    status_code=201
)
async def join_subject(
        subject: Subject = Depends(retrieve_subject_by_uuid),
        user: User = Depends(get_authenticated_user),
        db: AsyncSession = Depends(get_async_db)
) -> Subject:
    await service.create_subject_student(db,subject.id,user.uid)
    return subject


@router.delete(
    "/{subject_id}/students/{user_id}",
    dependencies=[Depends(teacher_or_admin_user_validation)],
)
async def delete_subject_student(
    subject_id: int, user_id: str, db: AsyncSession = Depends(get_async_db)
):
    await service.delete_subject_student(db, subject_id, user_id)


# ---------------Projects------------


@router.get("/{subject_id}/projects")
async def list_projects(
    subject_id: int, db: AsyncSession = Depends(get_async_db)
) -> ProjectList:
    projects = await get_projects_for_subject(db, subject_id)
    return projects
