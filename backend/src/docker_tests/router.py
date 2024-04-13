from typing import List

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from . import service
from .dependencies import patch_permission_validation, delete_permission_validation
from .docker_tests import build_image
from .service import update_test_files
from ..dependencies import get_async_db
from ..project.dependencies import retrieve_project
from ..project.schemas import Project

router = APIRouter(
    prefix="/api/docker_test"
)


@router.get("/build")
async def test():
    build_image("bla")
    return [{"success"}]


@router.get("/{project_id}", response_model=Project)
async def get_test_files(project: Project = Depends(retrieve_project)):
    return project


@router.patch(
    "/{project_id}/test_files",
    response_model=Project,
    dependencies=[Depends(patch_permission_validation)],
)
async def patch_test_files(
    project_id: int,
    files: List[UploadFile],
    db: AsyncSession = Depends(get_async_db)
):
    return await update_test_files(db, project_id, files)


@router.delete("/{project_id}", dependencies=[Depends(delete_permission_validation)])
async def delete_test_files(
    project_id: int, db: AsyncSession = Depends(get_async_db)
):
    await service.delete_test_files(db, project_id)
    return {"message": "Files deleted successfully"}


