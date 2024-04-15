import os
from typing import Sequence

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src import config
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_group
from src.group.schemas import Group
from src.project.dependencies import retrieve_project
from src.submission.dependencies import (
    group_permission_validation,
    retrieve_submission,
)
from src.submission.exceptions import FileNotFound
from src.submission.utils import upload_files
from src.user.dependencies import admin_user_validation, get_authenticated_user
from src.user.schemas import User

from . import service
from .schemas import File, Submission

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
async def create_submission(files: list[UploadFile],
                            group: Group = Depends(retrieve_group),
                            user: User = Depends(get_authenticated_user),
                            db: AsyncSession = Depends(get_async_db)):
    project = await retrieve_project(group.project_id, user, db)
    uuid = upload_files(files, project)
    return await service.create_submission(db, uuid, group.id, group.project_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)


@router.get("/{submission_id}/files", response_model=list[File])
async def get_files(submission: Submission = Depends(retrieve_submission)):
    submission_dir = os.path.join(config.CONFIG.file_path, submission.files_uuid)
    output_files = []

    for root, _, files in os.walk(submission_dir):
        for file in files:
            path = os.path.join(root, file)
            output_files.append(FileResponse(
                filename=path.replace(f"{submission_dir}/", ""), path=path))
    return output_files


@router.get("/{submission_id}/files/{path:path}", response_class=FileResponse)
async def get_file(path: str, submission: Submission = Depends(retrieve_submission)):
    path = os.path.join(config.CONFIG.file_path, submission.files_uuid, path)

    if not os.path.isfile(path):
        raise FileNotFound

    return FileResponse(path=path)
