from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.group.dependencies import (
    is_authorized_to_join,
    is_authorized_to_leave,
    retrieve_group,
    retrieve_groups_by_project
)
from src.group.schemas import Group, GroupCreate
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service

router = APIRouter(
    prefix="/api/groups",
    tags=["groups"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.get("/")
async def get_groups(groups: list[Group] = Depends(retrieve_groups_by_project)):
    return groups


@router.post("/", status_code=201) #CHECK IF AUTHORIZED
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_async_db)):
    return await service.create_group(db,group)


@router.get("/{group_id}")
async def get_group(group: Group = Depends(retrieve_group)):
    return group


@router.delete(
    "/{group_id}", dependencies=[Depends(is_authorized_to_leave)], status_code=200
)
async def leave_group(
    group_id: int, user_id: str, db: AsyncSession = Depends(get_async_db)
):
    await service.leave_group(db, group_id, user_id)
    return "Successfully deleted"


@router.post(
    "/{group_id}",
    dependencies=[Depends(is_authorized_to_join), Depends(retrieve_group)],
    status_code=201,
)
async def join_group(
    group_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    await service.join_group(db, group_id, user.uid)
    return "Successfully joined"
