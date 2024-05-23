import os
import shutil
from uuid import uuid4

from fastapi import UploadFile
from starlette.responses import FileResponse

from src import config


def submissions_path(*paths: str) -> str:
    return str(os.path.abspath(os.path.join(config.CONFIG.file_path, "submissions", *paths)))


def submission_path(uuid: str, *paths: str) -> str:
    return submissions_path(uuid, "submission", *paths)


def artifacts_path(uuid: str, *paths) -> str:
    return submissions_path(uuid, "artifacts", *paths)


def feedback_path(uuid: str, *paths) -> str:
    return submissions_path(uuid, "feedback", *paths)


def tests_path(uuid: str, *paths) -> str:
    return str(os.path.abspath(os.path.join(config.CONFIG.file_path, "projects", uuid, *paths)))


def write_and_unpack_files(files: list[UploadFile], uuid: str | None) -> str:
    if uuid is None:
        uuid = str(uuid4())

    files_path = tests_path(uuid)
    if os.path.exists(files_path):
        shutil.rmtree(files_path)  # remove possible present files
    os.makedirs(files_path)

    for upload_file in files:
        if upload_file.filename and upload_file.content_type:
            path = os.path.join(files_path, upload_file.filename)
            with open(path, 'w+b') as f:
                shutil.copyfileobj(upload_file.file, f)

            if upload_file.content_type == "application/zip":
                shutil.unpack_archive(path, files_path)

    return uuid


def remove_test_files(uuid: str):
    shutil.rmtree(tests_path(uuid))


def get_files_from_dir(dir_path: str) -> list[FileResponse]:
    output_files = []

    for root, _, files in os.walk(dir_path):
        for file in files:
            path = os.path.join(root, file)
            output_files.append(FileResponse(
                filename=path.replace(f"{dir_path}/", ""), path=path))
    return output_files
