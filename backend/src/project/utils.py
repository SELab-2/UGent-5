import os
import shutil
from uuid import uuid4

from fastapi import UploadFile

from src import config


def get_tests_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "projects", uuid, *paths))


def upload_test_files(files: list[UploadFile]) -> str | None:
    if not len(files):
        return None

    uuid = str(uuid4())
    files_path = get_tests_path(uuid)
    os.makedirs(files_path)

    for upload_file in files:
        if upload_file.filename and upload_file.content_type:
            path = os.path.join(files_path, upload_file.filename)
            with open(path, 'w+b') as f:
                shutil.copyfileobj(upload_file.file, f)

            if upload_file.content_type == "application/zip":
                shutil.unpack_archive(path, files_path)

    return uuid
