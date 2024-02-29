from sqlalchemy.orm import Session
from fastapi import Depends
from src.dependencies import get_db
from .exceptions import SubjectNotFound
from .schemas import Subject
from . import service


async def get_subject(subject_id: int, db: Session = Depends(get_db)) -> Subject:
    subject = await service.get_subject(db, subject_id)
    if not subject:
        raise SubjectNotFound()

    return subject
