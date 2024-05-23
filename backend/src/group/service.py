from typing import Sequence

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from . import schemas
from .models import Group, StudentGroup

from collections import defaultdict
import asyncio

locks = defaultdict(asyncio.Lock)


async def get_group_by_id(db: AsyncSession, group_id: int) -> Group | None:
    return (await db.execute(select(Group).filter_by(id=group_id))).unique().scalar_one_or_none()


async def get_groups_by_project(db: AsyncSession, project_id: int) -> Sequence[Group]:
    result = await db.execute(select(Group).where(Group.project_id == project_id))
    return result.scalars().unique().all()


async def get_groups_by_user(db: AsyncSession, user_id: str) -> Sequence[Group]:
    return (
        (
            await db.execute(
                select(Group).join(StudentGroup).filter_by(uid=user_id)
            )
        )
        .scalars()
        .unique()
        .all()
    )


async def create_group(db: AsyncSession, group: schemas.GroupCreate) -> Group:
    async with locks[group.project_id]:
        db_group = Group(**group.model_dump())
        db.add(db_group)
        await db.commit()
        await db.refresh(db_group)
        return db_group


async def join_group(db: AsyncSession, team_id: int, user_id: str):
    insert_stmnt = StudentGroup.insert().values(team_id=team_id, uid=user_id)
    await db.execute(insert_stmnt)
    await db.commit()


async def leave_group(db: AsyncSession, team_id: int, user_id: str):
    await db.execute(delete(StudentGroup).filter_by(team_id=team_id, uid=user_id))
    await db.commit()


async def delete_group(db: AsyncSession, group_id: int):
    await db.execute(delete(Group).filter_by(id=group_id))
    await db.commit()
