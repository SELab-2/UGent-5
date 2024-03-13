from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas


async def get_by_id(db: AsyncSession, user_id: str) -> models.User:
    return await db.get(models.User, user_id)


async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def set_admin(db: AsyncSession, user_id: str, value: bool):
    user = await get_by_id(db, user_id)
    user.is_admin = value
    await db.commit()
