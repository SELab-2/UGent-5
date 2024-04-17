from typing import List

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from . import service
from .dependencies import put_permission_validation, delete_permission_validation
from .service import update_test_files
from .utils import tests_path, get_files_from_dir
from ..auth.dependencies import authentication_validation
from ..dependencies import get_async_db
from ..project.dependencies import retrieve_project
from ..project.schemas import Project

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authentication_validation)],
)


@router.get("/{project_id}/test_files")
async def get_test_files(project: Project = Depends(retrieve_project)):
    return get_files_from_dir(tests_path(project.test_files_uuid))


@router.put(
    "/{project_id}/test_files",
    response_model=Project,
    dependencies=[Depends(put_permission_validation)],
)
async def put_test_files(
    project_id: int,
    files: List[UploadFile],
    db: AsyncSession = Depends(get_async_db)
):
    return await update_test_files(db, project_id, files)


@router.delete("/{project_id}/test_files", dependencies=[Depends(delete_permission_validation)])
async def delete_test_files(
    project_id: int, db: AsyncSession = Depends(get_async_db)
):
    await service.delete_test_files(db, project_id)
    return {"message": "Files deleted successfully"}
