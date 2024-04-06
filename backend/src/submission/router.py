import os
from typing import Sequence

from fastapi import APIRouter, Depends, UploadFile, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_group
from src.group.schemas import Group
from src.project.dependencies import retrieve_project
from src.submission.dependencies import (
    group_id_validation,
    retrieve_submission,
)
from src.submission.exceptions import FileNotFound
from src.submission.utils import upload_files, get_files_from_dir, get_submission_path, get_artifacts_path
from src.user.dependencies import admin_user_validation

from . import service
from .schemas import File, Submission
from ..docker_tests.utils import launch_docker_tests

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
             dependencies=[Depends(group_id_validation)])
async def create_submission(files: list[UploadFile],
                            background_tasks: BackgroundTasks,
                            group: Group = Depends(retrieve_group),
                            db: AsyncSession = Depends(get_async_db)):
    project = await retrieve_project(group.project_id, db)
    submission_uuid = upload_files(files, project)
    background_tasks.add_task(launch_docker_tests, submission_uuid, project.check_files_uuid)
    return await service.create_submission(db, submission_uuid, group.id, group.project_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)


@router.get("/{submission_id}/files", response_model=list[File])
async def get_files(submission: Submission = Depends(retrieve_submission)):
    submission_dir = get_submission_path(submission.files_uuid)
    return get_files_from_dir(submission_dir)


@router.get("/{submission_id}/files/{path:path}", response_class=FileResponse)
async def get_file(path: str, submission: Submission = Depends(get_submission)):
    path = get_submission_path(submission.files_uuid, path)

    if not os.path.isfile(path):
        raise FileNotFound

    return FileResponse(path=path)


@router.get("/{submission_id}/artifacts", response_model=list[File])
async def get_artifacts(submission: Submission = Depends(retrieve_submission)):
    artifact_dir = get_artifacts_path(submission.files_uuid)
    return get_files_from_dir(artifact_dir)


@router.get("/{submission_id}/artifacts/{path:path}", response_class=FileResponse)
async def get_artifact(path: str, submission: Submission = Depends(get_submission)):
    path = get_artifacts_path(submission.files_uuid, path)

    if not os.path.isfile(path):
        raise FileNotFound

    return FileResponse(path=path)
