import asyncio
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import src.docker_tests.utils as docker_utils
from src.submission.models import Status, ResultType
from src.submission.service import get_submission
from src.user.service import set_admin
from tests.test_subject import subject_id

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

test_files_path = Path(__file__).parent / "docker_test_files"


@pytest_asyncio.fixture
async def project_id(client: AsyncClient, db: AsyncSession, subject_id: int) -> int:
    """Create new project"""
    project["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    await set_admin(db, "test", False)
    return response.json()["id"]


@pytest_asyncio.fixture
async def project_with_default_tests_id(client: AsyncClient, db: AsyncSession, subject_id: int):
    """upload test files for project"""
    project["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    id = response.json()["id"]

    test_files = [
        ('files', ('run', open(test_files_path / "test_files/run", 'rb'))),
        ('files', ('test.py', open(test_files_path / "test_files/test.py", 'rb')))
    ]
    response = await client.put(
        f"/api/projects/{id}/test_files",
        files=test_files
    )
    await set_admin(db, "test", False)
    assert response.status_code == 200
    assert response.json()["test_files_uuid"]
    yield id

    # cleanup project files
    shutil.rmtree(docker_utils.tests_path(response.json()["test_files_uuid"]))


@pytest_asyncio.fixture
async def group_id(client: AsyncClient, db: AsyncSession, project_id: int):
    return await join_group(client, db, project_id)


@pytest_asyncio.fixture
async def group_id_with_default_tests(client: AsyncClient, db: AsyncSession, project_with_default_tests_id: int):
    return await join_group(client, db, project_with_default_tests_id)


async def join_group(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data["project_id"] = project_id
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)  # create group
    await set_admin(db, "test", False)
    group_id = response.json()["id"]
    await client.post(f"/api/groups/{group_id}")  # join group
    return group_id


@pytest.mark.asyncio
async def test_no_docker_tests(client: AsyncClient, group_id: int, project_id: int):
    with open(test_files_path / "submission_files/correct.py", "rb") as f:
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
async def test_default_tests_success(client: AsyncClient, group_id_with_default_tests: int):
    # make submission
    files = [
        ('files', ('submission.py', open(test_files_path / 'submission_files/correct.py', 'rb'))),
    ]
    response = await client.post("/api/submissions/",
                                 files=files,
                                 data={"remarks": "test"},
                                 params={"group_id": group_id_with_default_tests},
                                 )

    assert response.status_code == 201
    assert response.json()["status"] == Status.InProgress
    assert response.json()["testresults"] == []
    submission_id = response.json()["id"]

    # check that result is correct, apparently pytest somehow waits for docker test to finish
    response = await client.get(f"/api/submissions/{submission_id}")
    assert sorted([(r['type'], r['value']) for r in response.json()['testresults']]) == [
        (ResultType.OK, 'Eerste test geslaagd'),
        (ResultType.OK, 'Tweede test geslaagd'),
        (ResultType.StdOut, ''),
        (ResultType.StdErr, ''),
    ]
    assert response.json()['status'] == Status.Accepted

    artifact_response = await client.get(f"/api/submissions/{submission_id}/artifacts")
    assert artifact_response.json() == [
        {'filename': 'artifact.txt', 'media_type': 'text/plain'}]  # generated artifacts


@pytest.mark.asyncio
async def test_default_tests_failure(client: AsyncClient, group_id_with_default_tests: int):
    # make submission
    files = [
        ('files', ('submission.py', open(test_files_path / 'submission_files/incorrect.py', 'rb'))),
    ]
    response = await client.post("/api/submissions/",
                                 files=files,
                                 data={"remarks": "test"},
                                 params={"group_id": group_id_with_default_tests},
                                 )

    assert response.status_code == 201
    assert response.json()["status"] == Status.InProgress
    assert response.json()["testresults"] == []
    submission_id = response.json()["id"]

    # check that result is incorrect after tests finished
    response = await client.get(f"/api/submissions/{submission_id}")
    assert sorted([(r['type'], r['value']) for r in response.json()['testresults']]) == [
        (ResultType.OK, 'Eerste test geslaagd'),
        (ResultType.Failed, 'Tweede test mislukt!'),
        (ResultType.StdOut, ''),
        (ResultType.StdErr, ''),
    ]
    assert response.json()['status'] == Status.Rejected

    artifact_response = await client.get(f"/api/submissions/{submission_id}/artifacts")
    assert artifact_response.json() == []  # no generated artifacts
