import os
import shutil
import zipfile
import fnmatch
from uuid import uuid4

from fastapi import UploadFile
from starlette.responses import FileResponse

from src import config
from src.project.schemas import Project
from src.submission.exceptions import UnMetRequirements


def get_submission_path(uuid: str, *paths: str) -> str:
    return str(os.path.join(config.CONFIG.file_path, "submissions", uuid, "submission", *paths))


def get_artifacts_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "submissions", uuid, "artifacts", *paths))


def get_feedback_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "submissions", uuid, "feedback", *paths))


def upload_files(files: list[UploadFile], project: Project) -> str:
    uuid = str(uuid4())
    files_path = get_submission_path(uuid)
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
        shutil.rmtree(files_path)
        raise UnMetRequirements(errors)

    return uuid


def get_files_from_dir(dir_path: str) -> list[FileResponse]:
    output_files = []

    for root, _, files in os.walk(dir_path):
        for file in files:
            path = os.path.join(root, file)
            output_files.append(FileResponse(
                filename=path.replace(f"{dir_path}/", ""), path=path))
    return output_files
