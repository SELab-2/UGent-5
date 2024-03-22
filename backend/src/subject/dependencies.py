from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service
from .exceptions import SubjectNotFound
from .schemas import Subject, SubjectList, AddUserToSubject


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
    student_in: AddUserToSubject,
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    if not user.is_admin and user.uid != student_in.uid:
        students = await service.get_students(db, subject_id)
        instructors = await service.get_instructors(db, subject_id)
        if not list(filter(lambda instructor: instructor.uid == user.uid, instructors)):
            raise NotAuthorized()


async def instructor_permission_validation(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    print(user.is_admin, user.is_teacher)
    if not (user.is_admin or user.is_teacher):
        raise NotAuthorized()
