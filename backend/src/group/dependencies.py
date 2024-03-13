from fastapi import Depends
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from src.group.schemas import Group
from src.user.schemas import User
from src.project.models import Project

from . import service
from .exceptions import GroupNotFound
from ..auth.exceptions import NotAuthorized


# as teammember and as not teammember
async def retrieve_group(group_id: int, db: Session = Depends(get_db)) -> Group:
    group = await service.get_group_by_id(db, group_id)
    if not group:
        raise GroupNotFound()
    return Group.model_validate(group)


async def retrieve_groups_by_user(user: User, db: Session = Depends(get_db)) -> list[Group]:
    grouplist = await service.get_groups_by_user(db, user.uid)
    return grouplist


async def retrieve_groups_by_project(project_id: int, db: Session = Depends(get_db)) -> list[Group]:
    grouplist = await service.get_groups_by_project(db, project_id)
    return grouplist


async def is_authorized_to_leave(group_id: int, user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)):
    groups = await service.get_groups_by_user(db, user.uid)
    teachers = await service.get_teachers_by_group(db, user.uid, group_id)
    if not any(user.uid == teacher.uid for teacher in teachers):
        if not any(group.id == group_id for group in groups):
            raise NotAuthorized()


async def is_authorized_to_join(group_id: int, user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)):
    groups = await service.get_groups_by_user(db, user.uid)
    teachers = await service.get_teachers_by_group(db, user.uid, group_id)
    if not any(user.uid == teacher.uid for teacher in teachers):
        if any(group.id == group_id for group in groups):
            raise NotAuthorized()
