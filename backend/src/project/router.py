import src.project.service as project_service
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.subject.dependencies import user_permission_validation
from src.group.schemas import GroupList
from src.group.dependencies import retrieve_groups_by_project

from .exceptions import ProjectNotFoundException
from .schemas import Project, ProjectCreate, ProjectUpdate
from .service import (
    create_project,
    delete_project,
    update_project,
)

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.post(
    "/",
    response_model=Project,
    dependencies=[Depends(user_permission_validation)],
    status_code=201,
)
async def create_project_for_subject(
    project_in: ProjectCreate, db: AsyncSession = Depends(get_async_db)
):
    project = await create_project(db, project_in)
    return project


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: int, db: AsyncSession = Depends(get_async_db)):
    project = await project_service.get_project(db, project_id)
    if not project:
        raise ProjectNotFoundException()
    return project


# TODO: dependency klotp niet
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


@router.get("/{project_id}/groups")
async def get_groups(groups: GroupList = Depends(retrieve_groups_by_project)):
    return groups
