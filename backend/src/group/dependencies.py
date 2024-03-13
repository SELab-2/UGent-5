from typing import Sequence

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.group.schemas import Group
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from ..auth.exceptions import NotAuthorized
from . import service
from .exceptions import AlreadyInGroup, GroupNotFound


async def retrieve_group(
    group_id: int, db: AsyncSession = Depends(get_async_db)
) -> Group:
    group = await service.get_group_by_id(db, group_id)
    if not group:
        raise GroupNotFound()
    return group


async def retrieve_groups_by_user(
    user: User, db: AsyncSession = Depends(get_async_db)
) -> Sequence[Group]:
    return await service.get_groups_by_user(db, user.uid)


async def retrieve_groups_by_project(
    project_id: int, db: AsyncSession = Depends(get_async_db)
) -> Sequence[Group]:
    return await service.get_groups_by_project(db, project_id)


async def is_authorized_to_leave(
    group_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    groups = await service.get_groups_by_user(db, user.uid)
    teachers = await service.get_teachers_by_group(db, group_id)
    if not any(user.uid == teacher.uid for teacher in teachers):
        if not any(group.id == group_id for group in groups):
            raise NotAuthorized()


# TODO: take enroll_date into consideration
async def is_authorized_to_join(
    group_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    groups = await service.get_groups_by_user(db, user.uid)
    if any(group.id == group_id for group in groups):
        raise AlreadyInGroup()
