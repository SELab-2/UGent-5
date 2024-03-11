from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.group.dependencies import retrieve_groups_by_project, retrieve_group, is_authorized_user
from src.group.schemas import GroupList, Group
from src.subject.dependencies import user_permission_validation

from . import service

router = APIRouter(
    prefix="/api/subjects/{subject_id}/projects/{project_id}/groups",
    tags=["groups"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_groups(groups : GroupList = Depends(retrieve_groups_by_project)):
    return groups

@router.get("/{group_id}")
async def get_group(group: Group = Depends(retrieve_group)):
    return group

@router.delete("/{group_id}",
               dependencies=[Depends(user_permission_validation, is_authorized_user(True))], status_code=200)
async def leave_group(subject_id: int, db: Session = Depends(get_db)):
    await service.leave_group(db, subject_id)
    return "Successfully deleted"

@router.post("/{group_id}",
             dependencies=[Depends(user_permission_validation, is_authorized_user(False))], status_code=201)
async def join_group(subject_id: int, db: Session = Depends(get_db)):
    await service.join_group(db, subject_id)
    return "Successfully joined"
