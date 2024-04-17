import shutil

import pytest
from httpx import AsyncClient
from src.auth.exceptions import NotAuthorized
import os

from src.docker_tests.utils import submissions_path
# Import Fixtures
from tests.test_group import group_id
from tests.test_project import project_id
from tests.test_subject import subject_id


@pytest.mark.asyncio
async def test_create_submission(client: AsyncClient, group_id: int):
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
    files_uuid = response.json()['files_uuid']
    assert response.status_code == 201

    # Leave group
    await client.delete(f"/api/groups/{group_id}")

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
    await client.delete(f"/api/groups/{group_id}")

    response = await client.get(f"/api/submissions/{id}/files/testfile1.txt")
    assert response.status_code == NotAuthorized().status_code  # Not authorized

    await client.post(f"/api/groups/{group_id}")  # Join group
    response = await client.get(f"/api/submissions/{id}/files/testfile1.txt")
    assert response.status_code == 200
    assert next(response.iter_bytes()) == b"content1"

    response = await client.get(f"/api/submissions/{id}/files/testfile2.txt")
    assert next(response.iter_bytes()) == b"content2"

    # cleanup files
    shutil.rmtree(submissions_path(files_uuid))


# TODO:  check submission with project requirements
