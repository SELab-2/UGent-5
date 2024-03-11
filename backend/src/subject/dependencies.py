from typing import Sequence

from fastapi import Depends
from sqlalchemy.orm import Session
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service
from .exceptions import SubjectNotFound
from .schemas import Subject


async def retrieve_subject(subject_id: int, db: Session = Depends(get_db)) -> Subject:
    subject = await service.get_subject(db, subject_id)
    if not subject:
        raise SubjectNotFound()

    return Subject.model_validate(subject)


async def retrieve_subjects(
    _: User = Depends(get_authenticated_user), db: Session = Depends(get_db)
) -> Sequence[Subject]:
    subjects = await service.get_subjects(db)
    return subjects


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db),
):
    if not user.is_admin:
        teachers = await service.get_teachers(db, subject_id)
        if not list(filter(lambda teacher: teacher.id == user.uid, teachers)):
            raise NotAuthorized()
