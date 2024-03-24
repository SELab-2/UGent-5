import shutil
from typing import Sequence
from uuid import uuid4

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src import config
from src.dependencies import get_async_db
from src.group.dependencies import retrieve_group
from src.submission.dependencies import (
    create_permission_validation,
    retrieve_file,
    retrieve_submission,
)
from src.user.dependencies import admin_user_validation

from . import service
from .schemas import Submission, SubmissionCreate, File
import os

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
             dependencies=[Depends(create_permission_validation)])
async def create_submission(submission: SubmissionCreate,
                            db: AsyncSession = Depends(get_async_db)):
    group = await retrieve_group(submission.group_id, db)
    return await service.create_submission(db, submission, submission.group_id, group.project_id)


@router.delete("/{submission_id}",
               dependencies=[Depends(admin_user_validation)],
               status_code=200)
async def delete_submision(submission_id: int, db: AsyncSession = Depends(get_async_db)):
    await service.delete_submission(db, submission_id)


@router.post("/{submission_id}/files", status_code=201)
async def upload_files(upload_files: list[UploadFile],
                       submission: Submission = Depends(retrieve_submission),
                       db: AsyncSession = Depends(get_async_db)) -> list[File]:
    # TODO: extension validation here
    files: list[File] = []
    for upload_file in upload_files:
        if upload_file.filename and upload_file.content_type:
            uuid = str(uuid4())
            with open(os.path.join(config.CONFIG.file_path, uuid), 'w+b') as f:
                shutil.copyfileobj(upload_file.file, f)

            files.append(
                File(uid=uuid,
                     filename=upload_file.filename,
                     content_type=upload_file.content_type,
                     submission_id=submission.id
                     )
            )

    await service.upload_files(db, files)
    return files


@router.get("/{submission_id}/files")
async def get_files(db: AsyncSession = Depends(get_async_db),
                    submission: Submission = Depends(retrieve_submission)) -> Sequence[File]:
    return await service.get_files(db, submission.id)


@router.get("/files/{uuid}")
async def get_file(uuid: str, file: File = Depends(retrieve_file)):
    return FileResponse(path=os.path.join(config.CONFIG.file_path, uuid), media_type=file.content_type, filename=file.filename)
