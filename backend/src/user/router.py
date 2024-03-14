from fastapi import APIRouter, Depends
from src.group.schemas import GroupList

from .dependencies import (
    get_authenticated_user,
    retrieve_groups,
    retrieve_projects,
    retrieve_subjects,
    retrieve_user,
)
from .schemas import User, UserProjectList, UserSimple, UserSubjectList

router = APIRouter(
    prefix="/api/users", tags=["user"], responses={404: {"description": "Not Found"}}
)


@router.get("/me")
async def me(user: User = Depends(get_authenticated_user)) -> User:
    """
    Get information about the current user
    """
    return user


@router.get("/{user_id}", dependencies=[Depends(get_authenticated_user)])
async def user(user: UserSimple = Depends(retrieve_user)) -> UserSimple:
    """
    Get information about the user with the given user_id
    """
    return user


@router.get("/me/subjects")
async def subjects(
    subjects: UserSubjectList = Depends(retrieve_subjects),
) -> UserSubjectList:
    """
    Get the subjects of the current user
    """
    return subjects


@router.get("/me/projects")
async def projects(
    projects: UserProjectList = Depends(retrieve_projects),
) -> UserProjectList:
    """
    Get the projects of the current user
    """
    return projects


@router.get("/me/groups")
async def groups(groups: GroupList = Depends(retrieve_groups)) -> GroupList:
    """
    Get the groups of the current user
    """
    return groups
