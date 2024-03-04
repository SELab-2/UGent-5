from typing import Sequence
from sqlalchemy.orm import Session
from src.user.models import User
from . import models, schemas


async def get_subject(db: Session, subject_id: int) -> models.Subject:
    return db.query(models.Subject).filter_by(id=subject_id).first()


async def get_subjects(db: Session, user_id: str) -> tuple[Sequence[models.Subject],
                                                           Sequence[models.Subject]]:
    return (db.query(models.Subject).join(models.TeacherSubject).
            filter(models.TeacherSubject.c.teacher_id == user_id).all(),

            db.query(models.Subject).join(models.StudentSubject).
            filter(models.StudentSubject.c.student_id == user_id).all()
            )


async def get_teachers(db: Session, subject_id: int) -> list[User]:
    return db.query(User).join(models.TeacherSubject).filter(
        models.TeacherSubject.c.subject_id == subject_id).all()


async def create_subject(db: Session, subject: schemas.SubjectCreate) -> models.Subject:
    """Create and return a new subject"""
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


async def create_subject_teacher(db: Session, subject_id: int, user_id: str):
    insert_stmnt = models.TeacherSubject.insert().values(
        subject_id=subject_id, teacher_id=user_id)
    db.execute(insert_stmnt)
    db.commit()


async def delete_subject_teacher(db: Session, subject_id: int, user_id: str):
    db.query(models.TeacherSubject).filter_by(
        subject_id=subject_id, teacher_id=user_id).delete()
    db.commit()


async def delete_subject(db: Session, subject: schemas.Subject):
    """Remove a subject"""
    db.delete(subject)
    db.commit()
