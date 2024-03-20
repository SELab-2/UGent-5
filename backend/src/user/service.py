from sqlalchemy.ext.asyncio import AsyncSession

from .models import User
from .schemas import UserCreate


async def get_by_id(db: AsyncSession, user_id: str) -> User:
    return await db.get(User, user_id)


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
