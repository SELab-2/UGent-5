from fastapi import Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service
from .exceptions import SubjectNotFound
from .schemas import Subject, SubjectList


async def retrieve_subject(
    subject_id: int, db: AsyncSession = Depends(get_async_db)
) -> Subject:
    subject = await service.get_subject(db, subject_id)
    if not subject:
        raise SubjectNotFound()

    return Subject.model_validate(subject)


async def retrieve_subjects(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> SubjectList:
    subjects = await service.get_subjects(db)
    return SubjectList(subjects=subjects)


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    if not user.is_admin:
        instructors = await service.get_instructors(db, subject_id)
        if not list(filter(lambda instructor: instructor.uid == user.uid, instructors)):
            raise NotAuthorized()


async def add_student_permission_validation(
    subject_id: int,
    student_uid: str = Body(..., embed=True),
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    if not user.is_admin and user.uid != student_uid:
        instructors = await service.get_instructors(db, subject_id)
        if not list(filter(lambda instructor: instructor.uid == user.uid, instructors)):
            raise NotAuthorized()


async def teacher_permission_validation(
    user: User = Depends(get_authenticated_user)
):
    if not (user.is_admin or user.is_teacher):
        raise NotAuthorized()
