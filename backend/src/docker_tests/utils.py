import os
import shutil

from fastapi import UploadFile

from src import config


def tests_path(uuid: str, *paths) -> str:
    return str(os.path.join(config.CONFIG.file_path, "projects", uuid, *paths))


def write_and_unpack_files(files: list[UploadFile], uuid: str):
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


def remove_test_files(uuid: str):
    shutil.rmtree(tests_path(uuid))
