import os
import shutil
import zipfile
import pathlib
import io
import fnmatch
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.docker_tests.utils import submissions_path
from src.project.schemas import Project
from src.submission.exceptions import UnMetRequirements
from src.submission.schemas import Submission

from src.group.service import get_group_by_id
from src.group.exceptions import GroupNotFound
from ..docker_tests.utils import submission_path, get_files_from_dir, artifacts_path


def upload_files(files: list[UploadFile], project: Project) -> str:
    uuid = str(uuid4())
    files_path = submission_path(uuid)
    os.makedirs(files_path)

    filelist = []
    for upload_file in files:
        if upload_file.filename and upload_file.content_type:
            path = os.path.join(files_path, upload_file.filename)
            filelist.append(upload_file.filename)
            with open(path, 'w+b') as f:
                shutil.copyfileobj(upload_file.file, f)

            if upload_file.content_type == "application/zip":
                filelist.extend(zipfile.ZipFile(path, 'r').namelist())

    errors = []
    for r in project.requirements:
        matches = [file for file in filelist if fnmatch.fnmatch(file, r.value)]

        if not r.mandatory and len(matches):
            errors.append({"type": "forbidden", "requirement": r.value,
                          "msg": f"Forbidden file(s) found: {r.value}", "files": matches})
        elif r.mandatory and not len(matches):
            errors.append({"type": "mandatory", "requirement": r.value,
                          "msg": f"Required file not found: {r.value}"})

    if len(errors):
        remove_files(uuid)
        raise UnMetRequirements(errors)

    return uuid


async def zip_stream(db: AsyncSession, submission: Submission):
    base_path = pathlib.Path(submission_path(submission.files_uuid))
    group = await get_group_by_id(db, submission.group_id)

    if not group:
        raise GroupNotFound()

    data = io.BytesIO()
    with zipfile.ZipFile(data, mode='w') as z:
        for f_name in base_path.iterdir():
            name = f"group_{group.num}/{str(f_name).replace(str(base_path), "")}"
            z.write(f_name, arcname=name)
    data.seek(0)
    return data


def remove_files(uuid: str):
    shutil.rmtree(submissions_path(uuid))
