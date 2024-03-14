from fastapi import APIRouter, Depends
from src.auth.dependencies import authentication_validation
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
    prefix="/api/users",
    tags=["user"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.get("/{user_id}")
async def user_info(user: UserSimple = Depends(retrieve_user)) -> UserSimple:
    """
    Get information about a user
    """
    return user


@router.get("/me")
async def profile(user: User = Depends(get_authenticated_user)) -> User:
    """
    Get information about the current user
    """
    return user


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
