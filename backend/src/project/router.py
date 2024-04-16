from typing import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_groups_by_project
from src.group.schemas import GroupList
from src.submission.schemas import Submission
from src.submission.service import get_submissions_by_project
from . import service
from .dependencies import (
    create_permission_validation,
    delete_permission_validation,
    patch_permission_validation,
    retrieve_project,
)
from .schemas import Project, ProjectCreate, ProjectUpdate
from .service import (
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
    dependencies=[Depends(create_permission_validation)],
    status_code=201,
)
async def create_project(
    project_in: ProjectCreate, db: AsyncSession = Depends(get_async_db)
):
    return await service.create_project(db, project_in)


@router.get("/{project_id}", response_model=Project)
async def get_project(project: Project = Depends(retrieve_project)):
    return project


@router.delete("/{project_id}", dependencies=[Depends(delete_permission_validation)])
async def delete_project_for_subject(
    project_id: int, db: AsyncSession = Depends(get_async_db)
):
    await delete_project(db, project_id)


@router.patch(
    "/{project_id}",
    response_model=Project,
    dependencies=[Depends(patch_permission_validation)],
)
async def patch_project_for_subject(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_async_db),
):
    return await update_project(db, project_id, project_update)


@router.get("/{project_id}/groups")
async def list_groups(groups: GroupList = Depends(retrieve_groups_by_project)):
    return groups


@router.get("/{project_id}/submissions", dependencies=[Depends(patch_permission_validation)])
async def list_submissions(group_id: int,
                           db: AsyncSession = Depends(get_async_db)
                           ) -> Sequence[Submission]:
    return await get_submissions_by_project(db, group_id)
