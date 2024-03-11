from fastapi import Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from src.group.schemas import Group, GroupList
from src.user.schemas import User

from . import service
from .exceptions import NotAuthorized, NotAuthorizedToLeave, GroupNotFound


# as teammember and as not teammember
async def retrieve_group(group_id: int, db: Session = Depends(get_db)) -> Group:
    group = await service.get_group_by_id(db, group_id)
    if not group:
        raise GroupNotFound()
    return Group.model_validate(group)


async def retrieve_groups_by_user(user: User, db: Session = Depends(get_db)) -> GroupList:
    grouplist = await service.get_groups_by_user(db, user.uid)
    return GroupList.model_validate(grouplist)


async def retrieve_groups_by_project(project: Project, db: Session = Depends(get_db)) -> GroupList:
    grouplist = await service.get_groups_by_project(db, project.id)
    return GroupList.model_validate(grouplist)


async def is_authorized_user(member: bool, group_id: int, user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)):
    groups = await service.get_groups_by_user(db, user.uid)
    if member:
        if not any(group.id == group_id for group in groups):
            raise NotAuthorized()
