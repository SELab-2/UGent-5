from typing import List
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.docker_tests.utils import write_and_unpack_files, remove_test_files
from src.project.service import get_project


async def update_test_files(db: AsyncSession, project_id: int, test_files: List[UploadFile]):
    project = await get_project(db, project_id)

    if not project.test_files_uuid:
        uuid = str(uuid4())
    else:
        uuid = str(project.test_files_uuid)

    write_and_unpack_files(test_files, str(project.test_files_uuid))

    project.test_files_uuid = uuid
    await db.commit()
    await db.refresh(project)
    return project


async def delete_test_files(db: AsyncSession, project_id: int):
    project = await get_project(db, project_id)

    if not project.test_files_uuid:
        raise Exception

    remove_test_files(str(project.test_files_uuid))

    await db.delete(project)
    await db.commit()