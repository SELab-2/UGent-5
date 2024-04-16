import os
from typing import Sequence

from fastapi import APIRouter, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.dependencies import get_async_db
from src.group.dependencies import retrieve_group
from src.group.schemas import Group
from src.project.dependencies import retrieve_project
from src.submission.dependencies import (
    group_permission_validation,
    retrieve_submission,
)
from src.submission.exceptions import FileNotFound
from src.submission.exceptions import FilesNotFound
from src.submission.utils import get_files_from_dir, submission_path, artifacts_path
from src.submission.utils import upload_files
from src.user.dependencies import admin_user_validation, get_authenticated_user
from src.user.schemas import User
from . import service
from .models import Status
from .schemas import File, Submission, SubmissionCreate
from ..docker_tests.docker_tests import launch_docker_tests

router = APIRouter(
    prefix="/api/submissions",
    tags=["submission"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", dependencies=[Depends(admin_user_validation)])
async def get_submissions(db: AsyncSession = Depends(get_async_db)) -> Sequence[Submission]:
    return await service.get_submissions(db)


@router.get("/{submission_id}")
async def get_submission(submission: Submission = Depends(retrieve_submission)) -> Submission:
    return submission


@router.post("/", response_model=Submission, status_code=201,
             dependencies=[Depends(group_permission_validation)])
async def create_submission(background_tasks: BackgroundTasks,
                            submission_in: SubmissionCreate = Depends(),
                            group: Group = Depends(retrieve_group),
                            user: User = Depends(get_authenticated_user),
                            db: AsyncSession = Depends(get_async_db)):
    project = await retrieve_project(group.project_id, user, db)
    test_files_uuid = project.test_files_uuid
    submission_uuid = upload_files(submission_in.files, project)

    # accept submission immediately if no tests are present
    docker_tests_present = test_files_uuid is not None
    status = Status.Accepted if docker_tests_present else Status.InProgress

    submission = await service.create_submission(
        db, uuid=submission_uuid, remarks=submission_in.remarks, status=status, group_id=group.id, project_id=group.project_id
    )

    # launch docker tests
    if docker_tests_present:
        background_tasks.add_task(launch_docker_tests, db, submission, test_files_uuid)

    return submission


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)


@router.get("/{submission_id}/files", response_model=list[File])
async def get_files(submission: Submission = Depends(retrieve_submission)):
    submission_dir = submission_path(submission.files_uuid)
    return get_files_from_dir(submission_dir)


@router.get("/{submission_id}/files/{path:path}", response_class=FileResponse)
async def get_file(path: str, submission: Submission = Depends(get_submission)):
    path = submission_path(submission.files_uuid, path)

    if not os.path.isfile(path):
        raise FileNotFound

    return FileResponse(path=path)


@router.get("/{submission_id}/artifacts", response_model=list[File])
async def get_artifacts(submission: Submission = Depends(retrieve_submission)):
    if submission.status == Status.InProgress:
        raise FilesNotFound
    artifact_dir = artifacts_path(submission.files_uuid)
    return get_files_from_dir(artifact_dir)


@router.get("/{submission_id}/artifacts/{path:path}", response_class=FileResponse)
async def get_artifact(path: str, submission: Submission = Depends(get_submission)):
    if submission.status == Status.InProgress:
        raise FileNotFound

    path = artifacts_path(submission.files_uuid, path)

    if not os.path.isfile(path):
        raise FileNotFound

    return FileResponse(path=path)
