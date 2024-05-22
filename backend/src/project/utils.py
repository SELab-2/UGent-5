
from sqlalchemy.ext.asyncio import AsyncSession
from src.docker_tests.utils import submission_path
import pathlib
import zipfile
import csv
import io

from src.submission.models import Status
from src.submission.schemas import Submission
from typing import Sequence

from src.group.service import get_group_by_id
from src.group.exceptions import GroupNotFound


async def project_zip_stream(db: AsyncSession, submissions: Sequence[Submission], project_id):
    data = io.BytesIO()
    csvdata = io.StringIO()
    writer = csv.DictWriter(csvdata, fieldnames=[
                            "project", "group", "date", "status", "remarks", "stdout", "stderr"])
    writer.writeheader()

    with zipfile.ZipFile(data, mode='w') as z:

        for submission in submissions:
            path = pathlib.Path(submission_path(submission.files_uuid, ""))

            group = await get_group_by_id(db, submission.group_id)

            if not group:
                raise GroupNotFound()

            writer.writerow({'project': submission.project_id, 'group': group.num, 'date': submission.date, 'status': Status(
                submission.status).name, 'remarks': submission.remarks, 'stdout': submission.stdout, 'stderr': submission.stderr})

            for f_name in path.iterdir():
                name = f"project_{
                    project_id}/group_{group.num}/{str(f_name).replace(str(path), "")}"
                z.write(f_name, arcname=name)

        z.writestr(f"project_{project_id}/submissions.csv", csvdata.getvalue())

    data.seek(0)
    return data
