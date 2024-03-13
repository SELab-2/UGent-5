from typing import Sequence

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
from src.user.models import User


async def get_subject(db: AsyncSession, subject_id: int) -> models.Subject:
    result = await db.execute(select(models.Subject).filter_by(id=subject_id))
    return result.scalars().first()


async def get_subjects(db: AsyncSession, user_id: str) -> tuple[Sequence[models.Subject], Sequence[models.Subject]]:
    teachers_subjects = await db.execute(select(models.Subject).join(models.TeacherSubject).filter(models.TeacherSubject.c.uid == user_id))
    students_subjects = await db.execute(select(models.Subject).join(models.StudentSubject).filter(models.StudentSubject.c.uid == user_id))
    return teachers_subjects.scalars().all(), students_subjects.scalars().all()


async def get_teachers(db: AsyncSession, subject_id: int) -> Sequence[User]:
    result = await db.execute(select(User).join(models.TeacherSubject, models.TeacherSubject.c.subject_id == subject_id))
    return result.scalars().all()


async def create_subject(db: AsyncSession, subject: schemas.SubjectCreate) -> models.Subject:
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    await db.commit()
    await db.refresh(db_subject)
    return db_subject


async def create_subject_teacher(db: AsyncSession, subject_id: int, user_id: str):
    insert_stmnt = models.TeacherSubject.insert().values(subject_id=subject_id, uid=user_id)
    await db.execute(insert_stmnt)
    await db.commit()


async def delete_subject_teacher(db: AsyncSession, subject_id: int, user_id: str):
    await db.execute(delete(models.TeacherSubject).filter_by(subject_id=subject_id, uid=user_id))
    await db.commit()


async def delete_subject(db: AsyncSession, subject_id: int):
    await db.execute(delete(models.Subject).filter_by(id=subject_id))
    await db.commit()
