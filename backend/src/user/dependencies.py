import src.group.service as group_service
import src.project.service as project_service
import src.subject.service as subject_service
import src.user.service as user_service
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import jwt_token_validation
from src.auth.exceptions import NotAuthorized, UnAuthenticated
from src.dependencies import get_async_db
from src.group.schemas import GroupList
from src.project.schemas import ProjectList

from .exceptions import UserNotFound
from .schemas import User, UserSubjectList


async def get_authenticated_user(
    user_id: str = Depends(jwt_token_validation),
    db: AsyncSession = Depends(get_async_db),
) -> User:
    """Get current logged in user"""
    if not user_id:
        raise UnAuthenticated()
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()

    return user


async def admin_user_validation(user: User = Depends(get_authenticated_user)):
    """Checks if user is an admin"""
    if not user.is_admin:
        raise NotAuthorized()


async def teacher_or_admin_user_validation(
    user: User = Depends(get_authenticated_user),
):
    if not user.is_admin and not user.is_teacher:
        raise NotAuthorized()


async def user_id_validation(user_id: str, db: AsyncSession = Depends(get_async_db)):
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()


async def retrieve_user(
    user_id: str, db: AsyncSession = Depends(get_async_db)
) -> User:
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()
    return user


async def retrieve_subjects(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> UserSubjectList:
    instructor_subjects, student_subjects = await subject_service.get_subjects_by_user(
        db, user.uid
    )
    return UserSubjectList(as_student=student_subjects, as_instructor=instructor_subjects)


async def retrieve_groups(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> GroupList:
    groups = await group_service.get_groups_by_user(db, user.uid)
    return GroupList(groups=groups)


async def retrieve_projects(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> ProjectList:
    return await project_service.get_projects_by_user(db, user.uid)
