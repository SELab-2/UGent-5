from typing import Sequence

from sqlalchemy import delete, select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.models import User

from .models import StudentSubject, Subject, TeacherSubject
from .schemas import SubjectCreate


async def get_subjects(db: AsyncSession) -> Sequence[Subject]:
    subjects = await db.execute(select(Subject))
    return subjects.scalars().all()


async def get_subject(db: AsyncSession, subject_id: int) -> Subject:
    result = await db.execute(select(Subject).filter_by(id=subject_id))
    return result.scalars().first()


async def get_subjects_by_user(
    db: AsyncSession, user_id: str
) -> tuple[Sequence[Subject], Sequence[Subject]]:
    teachers_subjects = await db.execute(
        select(Subject).join(TeacherSubject).filter(
            TeacherSubject.c.uid == user_id)
    )
    students_subjects = await db.execute(
        select(Subject).join(StudentSubject).filter(
            StudentSubject.c.uid == user_id)

    )
    return teachers_subjects.scalars().all(), students_subjects.scalars().all()


async def get_teachers(db: AsyncSession, subject_id: int) -> Sequence[User]:
    result = await db.execute(
        select(User).join(TeacherSubject, User.uid == TeacherSubject.c.uid).where(
            TeacherSubject.c.subject_id == subject_id)
    )
    return result.scalars().all()


async def create_subject(db: AsyncSession, subject: SubjectCreate) -> Subject:
    db_subject = Subject(name=subject.name)
    db.add(db_subject)
    await db.commit()
    await db.refresh(db_subject)
    return db_subject


async def create_subject_teacher(db: AsyncSession, subject_id: int, user_id: str):
    insert_stmnt = TeacherSubject.insert().values(
        subject_id=subject_id, uid=user_id)
    await db.execute(insert_stmnt)
    await db.commit()


async def delete_subject_teacher(db: AsyncSession, subject_id: int, user_id: str):
    await db.execute(
        delete(TeacherSubject)
        .where(TeacherSubject.c.subject_id == subject_id)
        .where(TeacherSubject.c.uid == user_id)
    )
    await db.commit()


async def delete_subject(db: AsyncSession, subject_id: int):
    await db.execute(delete(Subject).where(Subject.id == subject_id))
    await db.commit()


async def create_subject_student(db: AsyncSession, subject_id: int, user_id: str):
    insert_stmnt = StudentSubject.insert().values(
        subject_id=subject_id, uid=user_id)
    await db.execute(insert_stmnt)
    await db.commit()


async def get_students(db: AsyncSession, subject_id: int) -> Sequence[User]:
    result = await db.execute(
        select(User).join(StudentSubject, User.uid == StudentSubject.c.uid).where(
            StudentSubject.c.subject_id == subject_id)
    )
    return result.scalars().all()


async def delete_subject_student(db: AsyncSession, subject_id: int, user_id: str):
    await db.execute(
        delete(StudentSubject)
        .where(StudentSubject.c.subject_id == subject_id)
        .where(StudentSubject.c.uid == user_id)
    )
    await db.commit()
