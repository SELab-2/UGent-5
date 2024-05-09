from typing import Sequence
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.group.dependencies import (
    create_group_validation,
    groups_permission_validation,
    retrieve_group,
)
from src.group.dependencies import join_group as join_group_dependency
from src.group.exceptions import GroupNotFound
from src.group.schemas import Group, GroupCreate
from src.submission.dependencies import group_permission_validation
from src.submission.schemas import Submission
from src.submission.service import get_submissions_by_group
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service

router = APIRouter(
    prefix="/api/groups",
    tags=["groups"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.post("/", status_code=201, dependencies=[Depends(create_group_validation)])
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_async_db)):
    return await service.create_group(db, group)


@router.get("/{group_id}")
async def get_group(group: Group = Depends(retrieve_group)):
    return group


@router.delete("/{group_id}", dependencies=[Depends(groups_permission_validation)])
async def delete_group(group_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_group(db, group_id)


@router.post("/{group_id}/leave", status_code=200)
async def leave_group(
    group: Group = Depends(retrieve_group),
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    if user not in group.members:
        raise GroupNotFound()

    await service.leave_group(db, group.id, user.uid)


@router.post("/{group_id}", status_code=201,)
async def join_group(group: Group = Depends(join_group_dependency)) -> Group:
    return group


@router.get("/{group_id}/submissions", dependencies=[Depends(group_permission_validation)])
async def list_submissions(group_id: int,
                           db: AsyncSession = Depends(get_async_db)
                           ) -> Sequence[Submission]:
    return await get_submissions_by_group(db, group_id)


@router.post("/{group_id}/{uid}", status_code=201, dependencies=[Depends(groups_permission_validation)])
async def join_group_by_uid(group: Group = Depends(join_group_dependency)) -> Group:
    return group


@router.delete("/{group_id}/{uid}", status_code=200, dependencies=[Depends(groups_permission_validation)])
async def remove_user_from_group(group_id: int, uid: str, db: AsyncSession = Depends(get_async_db)):
    await service.leave_group(db, group_id, uid)
