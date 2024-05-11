from datetime import datetime, timezone, timedelta

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.exceptions import NotAuthorized
import os

from src.docker_tests.utils import submissions_path
from src.user.service import set_admin
# Import Fixtures
from tests.test_group import group_id
from tests.test_project import project_id
from tests.test_subject import subject_id
from tests.test_docker import cleanup_files

subject = {"name": "test subject"}
future_date = datetime.now(timezone.utc) + timedelta(weeks=1)
project_with_reqs = {
    "name": "test project",
    "subject_id": 0,  # temp needs to be filled in by actual subject id
    "deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "description": "test",
    "enroll_deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "is_visible": True,
    "capacity": 1,
    "requirements": [{"mandatory": "true", "value": "*.py"}, {"mandatory": "false", "value": "*.pdf"}],
}

group_data = {"team_name": "test group", "project_id": 0}


@pytest_asyncio.fixture
async def project_with_reqs_id(client: AsyncClient, db: AsyncSession, subject_id: int) -> int:
    """Create new project"""
    project_with_reqs["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project_with_reqs)
    await set_admin(db, "test", False)
    return response.json()["id"]


@pytest_asyncio.fixture
async def group_with_reqs_id(client: AsyncClient, db: AsyncSession, project_with_reqs_id: int):
    group_data["project_id"] = project_with_reqs_id
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)
    await set_admin(db, "test", False)
    return response.json()["id"]


@pytest.mark.asyncio
async def test_create_submission(client: AsyncClient, group_id: int, cleanup_files):
    with open("testfile1.txt", "w") as f:
        f.write("content1")
    with open("testfile2.txt", "w") as f:
        f.write("content2")

    files = [('files', open('testfile1.txt', 'rb')),
             ('files', open('testfile2.txt', 'rb'))]

    response = await client.post(f"/api/submissions/", params={"group_id": group_id}, files=files)
    assert response.status_code == NotAuthorized().status_code
    assert response.json()["detail"] == NotAuthorized().detail

    # Submit
    await client.post(f"/api/groups/{group_id}")  # Join group
    response = await client.post(f"/api/submissions/", params={"group_id": group_id}, files=files)
    assert response.status_code == 201

    # Leave group
    await client.post(f"/api/groups/{group_id}/leave")

    # List files
    id = response.json()['id']
    response = await client.get(f"/api/submissions/{id}/files")
    assert response.status_code == NotAuthorized().status_code  # Not authorized

    await client.post(f"/api/groups/{group_id}")  # Join group
    response = await client.get(f"/api/submissions/{id}/files")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["media_type"] == "text/plain"
    assert response.json()[0]["filename"] in ["testfile1.txt", "testfile2.txt"]

    # Leave group
    await client.post(f"/api/groups/{group_id}/leave")

    response = await client.get(f"/api/submissions/{id}/files/testfile1.txt")
    assert response.status_code == NotAuthorized().status_code  # Not authorized

    await client.post(f"/api/groups/{group_id}")  # Join group
    response = await client.get(f"/api/submissions/{id}/files/testfile1.txt")
    assert response.status_code == 200
    assert next(response.iter_bytes()) == b"content1"

    response = await client.get(f"/api/submissions/{id}/files/testfile2.txt")
    assert next(response.iter_bytes()) == b"content2"

    # cleanup files
    os.remove("testfile1.txt")
    os.remove("testfile2.txt")
    await cleanup_files(id)


@pytest.mark.asyncio
async def test_project_requirements(client: AsyncClient, group_with_reqs_id: int, cleanup_files):
    mandatory_path = "mandatory.py"
    forbidden_path = "forbidden.pdf"
    optional_path = "whatever.txt"
    with open(mandatory_path, "w") as f:
        f.write("content1")
    with open(forbidden_path, "w") as f:
        f.write("content2")
    with open(optional_path, "w") as f:
        f.write("content2")

    mandatory = ('files', open(mandatory_path, 'rb'))
    forbidden = ('files', open(forbidden_path, 'rb'))
    optional = ('files', open(optional_path, 'rb'))

    await client.post(f"/api/groups/{group_with_reqs_id}")  # Join group

    # Submit without mandatory
    submissions_before = os.listdir(submissions_path())
    response = await client.post("/api/submissions/", params={"group_id": group_with_reqs_id}, files=[optional])
    assert response.status_code == 422
    assert len(response.json()["detail"]) == 1
    assert response.json()["detail"][0]["requirement"] == "*.py"
    assert response.json()["detail"][0]["type"] == "mandatory"
    assert os.listdir(submissions_path()) == submissions_before  # submission dirs did not change

    # Submit with forbidden
    submissions_before = os.listdir(submissions_path())
    response = await client.post(
        "/api/submissions/", params={"group_id": group_with_reqs_id}, files=[optional, forbidden]
    )
    assert response.status_code == 422
    assert len(response.json()["detail"]) == 2
    reqs = [(req["requirement"], req["type"]) for req in response.json()["detail"]]
    assert ("*.py", "mandatory") in reqs
    assert ("*.pdf", "forbidden") in reqs
    assert os.listdir(submissions_path()) == submissions_before  # submission dirs did not change

    # Submit with forbidden and mandatory
    submissions_before = os.listdir(submissions_path())
    response = await client.post(
        "/api/submissions/", params={"group_id": group_with_reqs_id}, files=[optional, forbidden, mandatory]
    )
    assert response.status_code == 422
    assert len(response.json()["detail"]) == 1
    reqs = [(req["requirement"], req["type"]) for req in response.json()["detail"]]
    assert ("*.pdf", "forbidden") == reqs[0]
    assert os.listdir(submissions_path()) == submissions_before  # submission dirs did not change

    # Submit with mandatory
    submissions_before = os.listdir(submissions_path())
    response = await client.post(
        "/api/submissions/", params={"group_id": group_with_reqs_id}, files=[optional, mandatory]
    )
    assert response.status_code == 201

    # exactly one submission was created with uuid equal to returned uuid
    assert set(os.listdir(submissions_path())).difference(set(submissions_before)) == {response.json()["files_uuid"]}

    await cleanup_files(response.json()["id"])

    # cleanup files
    for path in [mandatory_path, forbidden_path, optional_path]:
        os.remove(path)
