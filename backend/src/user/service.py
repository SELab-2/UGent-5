from typing import Sequence

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User
from .schemas import UserCreate
from ..subject.models import InstructorSubject, StudentSubject, Subject
from ..group.models import StudentGroup
from ..project.models import InstructorProject


async def get_by_id(db: AsyncSession, user_id: str) -> User:
    return await db.get(User, user_id)


async def get_all_users(db: AsyncSession) -> Sequence[User]:
    result = await db.execute(select(User))
    return result.scalars().all()


async def create_user(db: AsyncSession, user: UserCreate) -> User:
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def set_admin(db: AsyncSession, user_id: str, value: bool):
    user = await get_by_id(db, user_id)
    user.is_admin = value
    await db.commit()


async def set_teacher(db: AsyncSession, user_id: str, value: bool):
    user = await get_by_id(db, user_id)
    user.is_teacher = value
    await db.commit()


async def delete_user(db: AsyncSession, user_id: str):
    user = await get_by_id(db, user_id)
    if user:
        await db.execute(delete(StudentSubject).where(StudentSubject.c.uid == user_id))
        await db.execute(delete(InstructorProject).where(InstructorProject.c.uid == user_id))
        await db.execute(delete(StudentGroup).where(StudentGroup.c.uid == user_id))
        await db.flush()

        await db.delete(user)
        await db.commit()


async def get_instructors(db: AsyncSession) -> Sequence[User]:
    result = await db.execute(
        select(User).join(InstructorSubject, User.uid == InstructorSubject.c.uid)
    )
    return result.scalars().all()
