from fastapi import Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.exceptions import NotAuthorized
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service
from .exceptions import SubjectNotFound
from .schemas import Subject, TaskEnum


async def get_subject(subject_id: int, db: Session = Depends(get_db)) -> Subject:
    subject = await service.get_subject(db, subject_id)
    if not subject:
        raise SubjectNotFound()

    return Subject.model_validate(subject)


async def get_subjects(
    user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)
) -> list[Subject]:
    student_subjects, teacher_subjects = await service.get_subjects(db, user.id)

    return [
        Subject.model_validate(db_subject, context={"task": TaskEnum.student})
        for db_subject in student_subjects
    ] + [
        Subject.model_validate(db_subject, context={"task": TaskEnum.teacher})
        for db_subject in teacher_subjects
    ]


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db),
):
    teachers = await service.get_subject_teachers(db, subject_id)
    if not list(filter(lambda teacher: teacher.id == user.id, teachers)):
        raise NotAuthorized()
