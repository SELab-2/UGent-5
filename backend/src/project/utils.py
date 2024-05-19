
from sqlalchemy.ext.asyncio import AsyncSession
from src.docker_tests.utils import submission_path
import pathlib
import zipfile
import csv
import io

from src.submission.schemas import Submission
from typing import List

from src.group.service import get_group_by_id
from src.group.exceptions import GroupNotFound


async def project_zip_stream(db: AsyncSession, submissions: List[Submission]):
    data = io.BytesIO()

    with zipfile.ZipFile(data, mode='w') as z:
        for submission in submissions:
            path = pathlib.Path(submission_path(submission.files_uuid, ""))

            group = await get_group_by_id(db, submission.group_id)

            if not group:
                raise GroupNotFound()

            for f_name in path.iterdir():
                name = f"project_{
                    submission.project_id}/group_{group.num}/{str(f_name).replace(str(path), "")}"
                z.write(f_name, arcname=name)

    data.seek(0)
    return data
