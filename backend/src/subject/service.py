from typing import Sequence

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.models import User

from .models import StudentSubject, Subject, InstructorSubject
from . import schemas
from .schemas import SubjectCreate


async def get_subjects(db: AsyncSession) -> Sequence[Subject]:
    subjects = await db.execute(select(Subject))
    return subjects.scalars().all()


async def get_subject(db: AsyncSession, subject_id: int) -> Subject | None:
    result = await db.execute(select(Subject).filter_by(id=subject_id))
    return result.scalars().first()


async def update_subject(db: AsyncSession, subject: schemas.Subject) -> Subject:
    result = (await db.execute(update(Subject)
                               .values(**subject.model_dump()).where(Subject.id == subject.id)
                               .returning(Subject))).scalar_one_or_none()
    return result


async def get_subject_by_uuid(db: AsyncSession, subject_uuid: str) -> Subject | None:
    result = await db.execute(select(Subject).filter_by(uuid=subject_uuid))
    return result.scalars().first()


async def get_subjects_by_user(
    db: AsyncSession, user_id: str
) -> tuple[Sequence[Subject], Sequence[Subject]]:
    instructors_subjects = await db.execute(
        select(Subject).join(InstructorSubject).where(
            InstructorSubject.c.uid == user_id)
    )
    students_subjects = await db.execute(
        select(Subject).join(StudentSubject).where(
            StudentSubject.c.uid == user_id)

    )
    return instructors_subjects.scalars().all(), students_subjects.scalars().all()


async def get_instructors(db: AsyncSession, subject_id: int) -> Sequence[User]:
    result = await db.execute(
        select(User).join(InstructorSubject, User.uid == InstructorSubject.c.uid).where(
            InstructorSubject.c.subject_id == subject_id)
    )
    return result.scalars().all()


async def is_instructor(db: AsyncSession, subject_id: int, uid: str) -> bool:
    result = await db.execute(select(InstructorSubject)
                              .where(InstructorSubject.c.subject_id == subject_id)
                              .where(InstructorSubject.c.uid == uid))
    return result.scalar_one_or_none() != None


async def create_subject(db: AsyncSession, subject: SubjectCreate) -> Subject:
    db_subject = Subject(
        name=subject.name, academic_year=subject.academic_year, email=subject.email)
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


async def is_student(db: AsyncSession, subject_id: int, uid: str) -> bool:
    result = await db.execute(select(StudentSubject)
                              .where(StudentSubject.c.subject_id == subject_id)
                              .where(StudentSubject.c.uid == uid))
    return result.scalar_one_or_none() != None


async def delete_subject_student(db: AsyncSession, subject_id: int, user_id: str):
    await db.execute(
        delete(StudentSubject)
        .where(StudentSubject.c.subject_id == subject_id)
        .where(StudentSubject.c.uid == user_id)
    )
    await db.commit()
