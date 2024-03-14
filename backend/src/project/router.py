from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.subject.dependencies import user_permission_validation

from .exceptions import ProjectNotFoundException
from .schemas import ProjectCreate, ProjectResponse, ProjectUpdate
from .service import (
    create_project,
    delete_project,
    get_project,
    get_projects_for_subject,
    update_project,
)

router = APIRouter(
    prefix="/api/subjects/{subject_id}/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[ProjectResponse])
async def list_projects_for_subject(
    subject_id: int, db: AsyncSession = Depends(get_async_db)
):
    projects = await get_projects_for_subject(db, subject_id)
    return projects


@router.post(
    "/",
    response_model=ProjectResponse,
    dependencies=[Depends(user_permission_validation)],
    status_code=201,
)
async def create_project_for_subject(
    subject_id: int, project_in: ProjectCreate, db: AsyncSession = Depends(get_async_db)
):
    project = await create_project(db, project_in, subject_id)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
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
    response_model=ProjectResponse,
    dependencies=[Depends(user_permission_validation)],
)
async def patch_project_for_subject(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_async_db),
):
    return await update_project(db, project_id, project_update)
