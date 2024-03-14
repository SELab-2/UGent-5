from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.subject.dependencies import user_permission_validation

from .exceptions import ProjectNotFoundException
from .schemas import ProjectCreate, Project, ProjectUpdate
from .service import (
    create_project,
    delete_project,
    get_project,
    update_project,
)

router = APIRouter(
    prefix="/api/subjects/{subject_id}/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=Project,
    dependencies=[Depends(user_permission_validation)],
    status_code=201,
)
async def create_project_for_subject(
    subject_id: int, project_in: ProjectCreate, db: AsyncSession = Depends(get_async_db)
):
    project = await create_project(db, project_in, subject_id)
    return project


@router.get("/{project_id}", response_model=Project)
async def get_project_for_subject(
    project_id: int, db: AsyncSession = Depends(get_async_db)
):
    project = await get_project(db, project_id)
    if not project:
        raise ProjectNotFoundException()
    return project


@router.delete("/{project_id}", dependencies=[Depends(user_permission_validation)])
async def delete_project_for_subject(
    project_id: int, db: AsyncSession = Depends(get_async_db)
):
    await delete_project(db, project_id)
    return {"message": "Project deleted successfully"}


@router.patch(
    "/{project_id}",
    response_model=Project,
    dependencies=[Depends(user_permission_validation)],
)
async def patch_project_for_subject(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_async_db),
):
    return await update_project(db, project_id, project_update)
