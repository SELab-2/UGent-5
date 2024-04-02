import os
import shutil
import zipfile
import fnmatch
from uuid import uuid4

from fastapi import UploadFile

from src import config
from src.project.schemas import Project
from src.submission.exceptions import UnMetRequirements


def upload_files(files: list[UploadFile], project: Project) -> str:
    uuid = str(uuid4())
    dir_path = os.path.join(config.CONFIG.file_path, uuid)
    os.makedirs(dir_path)

    filelist = []
    for upload_file in files:
        if upload_file.filename and upload_file.content_type:
            path = os.path.join(dir_path, upload_file.filename)
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
        shutil.rmtree(dir_path)
        raise UnMetRequirements(errors)

    return uuid
