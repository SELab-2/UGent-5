import src.project.service as project_service
import src.subject.service as subject_service
import src.user.service as user_service
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from src.auth.dependencies import verify_jwt_token
from src.auth.exceptions import NotAuthorized, UnAuthenticated
from src.dependencies import get_async_db, get_db

from .exceptions import UserNotFound
from .schemas import User, UserGroupList, UserProjectList, UserSubjectList


async def get_authenticated_user(
    user_id: str = Depends(verify_jwt_token), db: Session = Depends(get_db)
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


async def user_id_validation(user_id: str, db: Session = Depends(get_db)):
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()


async def retrieve_subjects(
    user: User = Depends(get_authenticated_user), db: Session = Depends(get_db)
) -> UserSubjectList:
    teacher_subjects, student_subjects = await subject_service.get_subjects_by_user(
        db, user.uid
    )
    return UserSubjectList(as_student=student_subjects, as_teacher=teacher_subjects)


async def retrieve_groups(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> UserGroupList:
    # TODO: Implement this
    return UserGroupList(groups=[])


async def retrieve_projects(
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
) -> UserProjectList:
    projects = await project_service.get_projects_by_user(db, user.uid)
    return UserProjectList(projects=projects)
