from typing import Sequence, Optional

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.group.schemas import Group, GroupCreate, GroupList
from src.project.dependencies import retrieve_project
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User
from src.subject.utils import has_subject_privileges

from . import service
from .exceptions import AlreadyInGroup, AlreadyInGroupOfProject, GroupNotFound, MaxCapacity


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
) -> GroupList:
    groups = list(await service.get_groups_by_project(db, project_id))
    groups.sort(key=lambda x: x.num)
    return GroupList(groups=groups)


async def create_group_validation(
    group: GroupCreate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db)
):
    project = await retrieve_project(group.project_id, user, db)
    if not await has_subject_privileges(project.subject_id, user, db):
        raise NotAuthorized()


async def groups_permission_validation(
    group_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db)
):

    from src.group.utils import has_group_privileges
    if not await has_group_privileges(group_id, user, db, False):
        raise NotAuthorized()


async def join_group(
    group_id: int,
    uid: Optional[str] = None,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(get_authenticated_user)
) -> Group:

    if not uid:
        uid = user.uid

    group = await service.get_group_by_id(db, group_id)
    if not group:
        raise GroupNotFound()

    project = await retrieve_project(group.project_id, user, db)
    if uid in [member.uid for member in group.members]:
        raise AlreadyInGroup()

    if len(group.members) >= project.capacity:
        raise MaxCapacity()

    groups = await retrieve_groups_by_user(user, db)
    if any([group.project_id == g.project_id for g in groups]):
        raise AlreadyInGroupOfProject()

    await service.join_group(db, group_id, uid)
    return await service.get_group_by_id(db, group_id)
