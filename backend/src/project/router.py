from typing import Sequence, List

from docker import DockerClient
from fastapi import APIRouter, Depends, UploadFile, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src import dependencies
from src.auth.dependencies import authentication_validation
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_groups_by_project
from src.group.schemas import GroupList
from src.project.utils import project_zip_stream
from src.submission.schemas import Submission
from src.submission.service import get_submissions_by_project
from . import service
from .dependencies import (
    create_permission_validation,
    delete_permission_validation,
    patch_permission_validation,
    retrieve_project, retrieve_test_files_uuid,
)
from .schemas import Project, ProjectCreate, ProjectUpdate
from .service import (
    delete_project,
    update_project, update_test_files,
)
from ..docker_tests.dependencies import get_docker_client
from ..docker_tests.docker_tests import using_default_docker_image, build_docker_image
from ..docker_tests.utils import get_files_from_dir, tests_path, write_and_unpack_files, remove_test_files

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
async def list_submissions(project_id: int,
                           db: AsyncSession = Depends(get_async_db)
                           ) -> Sequence[Submission]:
    """Return a list of the latest submission of each group of this project"""
    return await get_submissions_by_project(db, project_id)


@router.get("/{project_id}/zip", response_class=StreamingResponse, dependencies=[Depends(patch_permission_validation)])
async def get_submissions_dump(project_id: int, db: AsyncSession = Depends(get_async_db)):
    """Return zip file containing all submission files and csv"""
    submissions = await get_submissions_by_project(db, project_id)
    data = await project_zip_stream(db, submissions, project_id)
    return StreamingResponse(data, media_type="application/zip")


@router.get("/{project_id}/test_files")
async def get_test_files(test_files_uuid: str = Depends(retrieve_test_files_uuid)):
    return get_files_from_dir(tests_path(test_files_uuid))


@router.put(
    "/{project_id}/test_files",
    response_model=Project,
    dependencies=[Depends(patch_permission_validation)],
)
async def put_test_files(
    background_tasks: BackgroundTasks,
    files: List[UploadFile],
    project: Project = Depends(retrieve_project),
    db: AsyncSession = Depends(get_async_db),
    client: DockerClient = Depends(get_docker_client)
):
    uuid = write_and_unpack_files(files, project.test_files_uuid)

    if not using_default_docker_image(uuid):
        # build custom docker image if dockerfile is present
        background_tasks.add_task(build_docker_image, tests_path(uuid), uuid, client)

    return await update_test_files(db, project.id, uuid)


@router.delete("/{project_id}/test_files", dependencies=[Depends(delete_permission_validation)])
async def delete_test_files(
    project: Project = Depends(retrieve_project),
    uuid: str = Depends(retrieve_test_files_uuid),
    db: AsyncSession = Depends(get_async_db)
):
    remove_test_files(uuid)
    return await service.update_test_files(db, project.id, None)
