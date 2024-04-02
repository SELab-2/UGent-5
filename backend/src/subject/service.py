from typing import Sequence

from sqlalchemy import delete, select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.models import User

from .models import StudentSubject, Subject, InstructorSubject
from .schemas import SubjectCreate, SubjectStudentSchema


async def get_subjects(db: AsyncSession) -> Sequence[Subject]:
    subjects = await db.execute(select(Subject))
    return subjects.scalars().all()


async def get_subject(db: AsyncSession, subject_id: int) -> Subject:
    result = await db.execute(select(Subject).filter_by(id=subject_id))
    return result.scalars().first()


async def get_subjects_by_user(
    db: AsyncSession, user_id: str
) -> tuple[Sequence[Subject], Sequence[Subject]]:
    instructors_subjects = await db.execute(
        select(Subject).join(InstructorSubject).filter(
            InstructorSubject.c.uid == user_id)
    )
    students_subjects = await db.execute(
        select(Subject).join(StudentSubject).filter(
            StudentSubject.c.uid == user_id)

    )
    return instructors_subjects.scalars().all(), students_subjects.scalars().all()


async def get_instructors(db: AsyncSession, subject_id: int) -> Sequence[User]:
    result = await db.execute(
        select(User).join(InstructorSubject, User.uid == InstructorSubject.c.uid).where(
            InstructorSubject.c.subject_id == subject_id)
    )
    return result.scalars().all()


async def create_subject(db: AsyncSession, subject: SubjectCreate) -> Subject:
    db_subject = Subject(name=subject.name)
    db.add(db_subject)
    await db.commit()
    await db.refresh(db_subject)
    return db_subject


async def add_instructor_to_subject(db: AsyncSession, subject_id: int, instructor_in: str):
    insert_stmnt = InstructorSubject.insert().values(
        subject_id=subject_id, uid=instructor_in)
    await db.execute(insert_stmnt)
    await db.commit()


async def delete_subject_instructor(db: AsyncSession, subject_id: int, user_id: str):
    await db.execute(
        delete(InstructorSubject)
        .where(InstructorSubject.c.subject_id == subject_id)
        .where(InstructorSubject.c.uid == user_id)
    )
    await db.commit()


async def delete_subject(db: AsyncSession, subject_id: int):
    await db.execute(delete(Subject).where(Subject.id == subject_id))
    await db.commit()


async def create_subject_student(db: AsyncSession, subject_id: int, student_in: str):
    insert_stmnt = StudentSubject.insert().values(
        subject_id=subject_id, uid=student_in)
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
