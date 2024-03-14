from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.subject.dependencies import user_permission_validation
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from .schemas import ProjectCreate
from .service import get_project


async def create_permission_validation(
    project_in: ProjectCreate,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    await user_permission_validation(project_in.subject_id, user, db)


async def patch_permission_validation(
    project_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_async_db),
):
    project = await get_project(db, project_id)
    await user_permission_validation(project.subject_id, user, db)


delete_permission_validation = patch_permission_validation
