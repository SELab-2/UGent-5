from typing import Sequence

from sqlalchemy.orm import Session
from src.user.models import User

from .models import StudentSubject, Subject, TeacherSubject
from .schemas import SubjectCreate


async def get_subject(db: Session, subject_id: int) -> Subject:
    return db.query(Subject).filter_by(id=subject_id).first()


async def get_subjects(db: Session) -> list[Subject]:
    return db.query(Subject).all()


async def get_subjects_by_user(
    db: Session, user_id: str
) -> tuple[Sequence[Subject], Sequence[Subject]]:
    return (
        db.query(Subject)
        .join(TeacherSubject)
        .filter(TeacherSubject.c.uid == user_id)
        .all(),
        db.query(Subject)
        .join(StudentSubject)
        .filter(StudentSubject.c.uid == user_id)
        .all(),
    )


async def get_teachers(db: Session, subject_id: int) -> list[User]:
    return (
        db.query(User)
        .join(TeacherSubject, TeacherSubject.c.subject_id == subject_id)
        .all()
    )


async def create_subject(db: Session, subject: SubjectCreate) -> Subject:
    """Create and return a new subject"""
    db_subject = Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


async def create_subject_teacher(db: Session, subject_id: int, user_id: str):
    insert_stmnt = TeacherSubject.insert().values(subject_id=subject_id, uid=user_id)
    db.execute(insert_stmnt)
    db.commit()


async def delete_subject_teacher(db: Session, subject_id: int, user_id: str):
    db.query(TeacherSubject).filter_by(subject_id=subject_id, uid=user_id).delete()
    db.commit()


async def delete_subject(db: Session, subject_id: int):
    """Remove a subject"""
    db.query(Subject).filter_by(id=subject_id).delete()
    db.commit()
