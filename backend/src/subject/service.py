from sqlalchemy.orm import Session
from src.user.models import User
from . import models, schemas


async def get_subject(db: Session, subject_id: int) -> models.Subject:
    return db.query(models.Subject).filter_by(id=subject_id).first()


async def get_subjects(
    db: Session, user_id
) -> tuple[list[models.Subject], list[models.Subject]]:
    """Return a tuple: (subjects where user is student, subjects where user is teacher)"""
    return (
        db.query(models.StudentSubject)  # Subjects where you are student
        .filter_by(student_id=user_id)
        .join(models.Subject)
        .all(),
        db.query(models.TeacherSubject)  # Subjects where you are teacher
        .filter_by(teacher_id=user_id)
        .join(models.Subject)
        .all(),
    )


async def get_subject_teachers(db: Session, subject_id: int) -> list[User]:
    """Return all the teachers of a subject"""
    return (
        db.query(models.TeacherSubject)
        .filter_by(subject_id=subject_id)
        .join(User)
        .all()
    )


async def create_subject(db: Session, subject: schemas.SubjectCreate) -> models.Subject:
    """Create and return a new subject"""
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


async def is_teacher_of_subject(db: Session, user_id: str, subject_id: int) -> bool:
    """Check if a user is a teacher of the subject."""
    teachers = await get_subject_teachers(db, subject_id)
    return any(teacher.uid == user_id for teacher in teachers)



async def remove_subject(db: Session, subject: schemas.Subject):
    """Remove a subject"""
    db.delete(subject)
    db.commit()
