import asyncio
import shutil
from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import src.docker_tests.utils as docker_utils
from src.submission.models import Status
from src.user.service import set_admin

subject = {"name": "test subject"}
future_date = datetime.now(timezone.utc) + timedelta(weeks=1)
project = {
    "name": "test project",
    "subject_id": 0,  # temp needs to be filled in by actual subject id
    "deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "description": "test",
    "enroll_deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "is_visible": True,
    "capacity": 1,
    "requirements": [{"mandatory": "true", "value": "*.py"}],
    "test_files": [],
}

group_data = {"team_name": "test group", "project_id": 0}


@pytest_asyncio.fixture
async def subject_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new subject"""
    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    return response.json()["id"]


@pytest_asyncio.fixture
async def project_id(client: AsyncClient, db: AsyncSession, subject_id: int) -> int:
    """Create new project"""
    project["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    project_id = response.json()["id"]
    return project_id


@pytest_asyncio.fixture
async def project_with_tests_id(client: AsyncClient, db: AsyncSession, project_id: int):
    """upload test files for project"""
    test_files = [
        ('files', ('run', open('docker_test_files/test_files/run', 'rb'))),
        ('files', ('test.py', open('docker_test_files/test_files/test.py', 'rb')))
    ]
    response = await client.put(
        f"/api/projects/{project_id}/test_files",
        files=test_files
    )
    assert response.status_code == 200
    assert response.json()["test_files_uuid"]
    yield project_id

    # cleanup project files
    shutil.rmtree(docker_utils.tests_path(response.json()["test_files_uuid"]))


@pytest_asyncio.fixture
async def group_id(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data["project_id"] = project_id
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)
    return response.json()["id"]


@pytest.mark.asyncio
async def test_no_docker_tests(client: AsyncClient, group_id: int, project_id: int):
    with open("docker_test_files/submission_files/correct.py", "rb") as f:
        response = await client.post("/api/submissions/",
                                     files={"files": ("correct.py", f)},
                                     data={"remarks": "test"},
                                     params={"group_id": group_id},
                                     )

    assert response.status_code == 201
    assert response.json()["status"] == Status.Accepted
    assert response.json()["remarks"] == "test"
    assert response.json()["testresults"] == []

    submission_id = response.json()["id"]
    artifact_response = await client.get(f"/api/submissions/{submission_id}/artifacts")

    assert artifact_response.json() == []  # no artifacts generated because no tests were run


@pytest.mark.asyncio
async def test_default_tests_success(client: AsyncClient, db: AsyncSession, group_id: int, project_with_tests_id: int):
    # make submission
    files = [
        ('files', ('submission.py', open('docker_test_files/submission_files/correct.py', 'rb'))),
    ]
    response = await client.post("/api/submissions/",
                                 files=files,
                                 data={"remarks": "test"},
                                 params={"group_id": group_id},
                                 )

    assert response.status_code == 201
    assert response.json()["status"] == Status.InProgress
    assert response.json()["testresults"] == []
    submission_id = response.json()["id"]

    # wait for tests to finish
    await asyncio.sleep(2)

    submission = await client.get(f"/api/submissions/{submission_id}")
    assert submission.status_code == 200
    assert response.json() == ""
    assert response.json()["status"] == Status.Accepted
    assert submission.json()["testresults"] == ""

    artifact_response = await client.get(f"/api/submissions/{submission_id}/artifacts")
    assert artifact_response.json() == []  # generated artifacts
