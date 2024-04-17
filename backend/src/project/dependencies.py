from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.subject.dependencies import retrieve_subject, user_permission_validation
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User
from src.subject.utils import has_subject_privileges

from .schemas import Project, ProjectCreate
from .service import get_project
from .exceptions import ProjectNotFound


async def retrieve_project(project_id: int,
                           user: User = Depends(get_authenticated_user),
                           db: AsyncSession = Depends(get_async_db)):
    project = await get_project(db, project_id)
    if not project or \
            (not project.is_visible and not await has_subject_privileges(project.subject_id, user, db)):
        raise ProjectNotFound
    return project


async def create_permission_validation(
    project_in: ProjectCreate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    await user_permission_validation(project_in.subject_id, user, db)
    await retrieve_subject(project_in.subject_id, db)


async def patch_permission_validation(
    project: Project = Depends(retrieve_project),
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    await user_permission_validation(project.subject_id, user, db)


delete_permission_validation = patch_permission_validation
