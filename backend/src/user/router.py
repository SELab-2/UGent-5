from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.group.schemas import GroupList
from src.project.schemas import UserProjectList

from .dependencies import (
    get_authenticated_user,
    retrieve_groups,
    retrieve_projects,
    retrieve_subjects,
    retrieve_user,
    admin_user_validation,
    teacher_or_admin_user_validation,
)
from .schemas import User, UserSimple, UserSubjectList
from .service import set_admin, set_teacher, get_all_users
from . import service

router = APIRouter(
    prefix="/api/users",
    tags=["user"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.get("/", dependencies=[Depends(teacher_or_admin_user_validation)])
async def get_users(
    db: AsyncSession = Depends(get_async_db),
) -> list[User]:
    """
    Get information about the current user
    """
    users = await get_all_users(db)
    return list(users)


@router.get("/me")
async def profile(user: User = Depends(get_authenticated_user)) -> User:
    """
    Get information about the current user
    """
    return user


@router.get("/{user_id}")
async def user_info(user: UserSimple = Depends(retrieve_user)) -> UserSimple:
    """
    Get information about a user
    """
    return user


@router.delete("/{user_id}", dependencies=[Depends(admin_user_validation)])
async def delete_user(user: User = Depends(retrieve_user), db: AsyncSession
                      = Depends(get_async_db)):
    """
    Delete a user
    """
    await service.delete_user(db, user.uid)


@router.get("/me/subjects")
async def list_subjects(
    subjects: UserSubjectList = Depends(retrieve_subjects),
) -> UserSubjectList:
    """
    Get the subjects of the current user
    """
    return subjects


@router.get("/me/projects")
async def list_projects(
    projects: UserProjectList = Depends(retrieve_projects),
) -> UserProjectList:
    """
    Get the projects of the current user
    """
    return projects


@router.get("/me/groups")
async def list_groups(groups: GroupList = Depends(retrieve_groups)) -> GroupList:
    """
    Get the groups of the current user
    """
    return groups


@router.post("/{user_id}/admin", dependencies=[Depends(admin_user_validation)])
async def toggle_admin(
    user: User = Depends(retrieve_user),
    db: AsyncSession = Depends(get_async_db),
):
    """
    Toggle the admin status of a user
    """
    await set_admin(db, user.uid, not user.is_admin)


@router.post("/{user_id}/teacher", dependencies=[Depends(admin_user_validation)])
async def toggle_teacher(
    user: User = Depends(retrieve_user),
    db: AsyncSession = Depends(get_async_db),
):
    """
    Toggle the teacher status of a user
    """
    await set_teacher(db, user.uid, not user.is_teacher)
