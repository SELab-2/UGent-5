import os
import shutil
import zipfile
import pathlib
import io
import fnmatch
from uuid import uuid4

from fastapi import UploadFile

from src.docker_tests.utils import submission_path, submissions_path
from src.project.schemas import Project
from src.submission.exceptions import UnMetRequirements


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


def zip_stream(path, group_id: int):
    base_path = pathlib.Path(path)
    data = io.BytesIO()
    with zipfile.ZipFile(data, mode='w') as z:
        for f_name in base_path.iterdir():
            name = f"group_{group_id}/{str(f_name).replace(path, "")}"
            z.write(f_name, arcname=name)
    data.seek(0)
    yield from data


def remove_files(uuid: str):
    shutil.rmtree(submissions_path(uuid))
