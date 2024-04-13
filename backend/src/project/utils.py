import os
import shutil
from uuid import uuid4

from fastapi import UploadFile

from src import config


def tests_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "projects", uuid, *paths))


def upload_test_files(files: list[UploadFile], uuid: str | None) -> str:
    if uuid is None:
        uuid = str(uuid4())  # there were no tests before this
    else:
        files_path = tests_path(uuid)
        shutil.rmtree(files_path)  # remove present files

    files_path = tests_path(uuid)
    os.makedirs(files_path)

    write_and_unzip_files(files, files_path)
    return uuid


def remove_test_files(uuid: str):
    files_path = tests_path(uuid)
    shutil.rmtree(files_path)


def write_and_unzip_files(files: list[UploadFile], files_path: str):
    for upload_file in files:
        if upload_file.filename and upload_file.content_type:
            path = os.path.join(files_path, upload_file.filename)
            with open(path, 'w+b') as f:
                shutil.copyfileobj(upload_file.file, f)

            if upload_file.content_type == "application/zip":
                shutil.unpack_archive(path, files_path)
