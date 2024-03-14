from typing import Sequence

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.user.models import User

from src.project import models as projectModels
from src.subject import models as subjectModels
from . import schemas
from .models import Group, StudentGroup


async def get_group_by_id(db: AsyncSession, group_id: int) -> Group | None:
    return (await db.execute(select(Group).filter_by(id=group_id))).scalar_one_or_none()


async def get_groups_by_project(db: AsyncSession, project_id: int) -> Sequence[Group]:
    result = await db.execute(select(Group).where(Group.project_id == project_id))
    return result.scalars().all()


async def get_groups_by_user(db: AsyncSession, user_id: str) -> Sequence[Group]:
    result = await db.execute(
        select(Group)
        .join(StudentGroup, StudentGroup.c.team_id == Group.id)
        .where(StudentGroup.c.uid == user_id)
    )
    return result.scalars().all()


async def get_teachers_by_group(db: AsyncSession, group_id: int) -> Sequence[User]:
    return (
        (
            await db.execute(
                select(User)
                .join(subjectModels.TeacherSubject)
                .join(subjectModels.Subject)
                .join(projectModels.Project)
                .join(Group, Group.id == group_id)
            )
        )
        .scalars()
        .all()
    )


async def create_group(db: AsyncSession, group: schemas.GroupCreate) -> Group:
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
