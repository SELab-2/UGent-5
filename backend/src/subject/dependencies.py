from fastapi import Depends
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

    return subject


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
        teachers = await service.get_teachers(db, subject_id)
        if not list(filter(lambda teacher: teacher.uid == user.uid, teachers)):
            raise NotAuthorized()
