from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.group.dependencies import retrieve_groups_by_project, retrieve_group, is_authorized_to_join, is_authorized_to_leave
from src.group.schemas import Group

from . import service

router = APIRouter(
    prefix="/api/projects/{project_id}/groups",
    tags=["groups"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def get_groups(groups: list[Group] = Depends(retrieve_groups_by_project)):
    return groups


@router.get("/{group_id}")
async def get_group(group: Group = Depends(retrieve_group)):
    return group


@router.delete("/{group_id}",
               dependencies=[Depends(is_authorized_to_leave)], status_code=200)
async def leave_group(group_id: int, user_id: str, db: Session = Depends(get_db)):
    await service.leave_group(db, group_id, user_id)
    return "Successfully deleted"


@router.post("/{group_id}",
             dependencies=[Depends(is_authorized_to_join)], status_code=201)
async def join_group(group_id: int, user_id: str, db: Session = Depends(get_db)):
    await service.join_group(db, group_id, user_id)
    return "Successfully joined"
