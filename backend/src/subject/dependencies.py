from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User
from src.subject.utils import has_subject_privileges

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

async def retrieve_subject_by_uuid(
    subject_uuid: str, db: AsyncSession = Depends(get_async_db)
) -> Subject:
    subject = await service.get_subject_by_uuid(db,subject_uuid)
    if not subject:
        raise SubjectNotFound()

    return Subject.model_validate(subject)

async def retrieve_uuid(subject_id: int, db: AsyncSession = Depends(get_async_db)) -> str:
    subject = await service.get_subject(db,subject_id)
    if not subject:
        raise SubjectNotFound()
    return subject.uuid


async def retrieve_subjects(
    db: AsyncSession = Depends(get_async_db),
) -> SubjectList:
    subjects = await service.get_subjects(db)
    return SubjectList(subjects=subjects)


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    if not await has_subject_privileges(subject_id,user,db):
        raise NotAuthorized()

async def teacher_permission_validation(
    user: User = Depends(get_authenticated_user)
):
    if not (user.is_admin or user.is_teacher):
        raise NotAuthorized()
