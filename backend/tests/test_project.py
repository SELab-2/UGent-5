from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.service import set_admin
from tests.test_subject import make_instructor

# skeletons for basic json objects
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
    "requirements": [],
    "test_files": [],
}


@pytest_asyncio.fixture
async def subject_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new subject"""
    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    await set_admin(db, "test", False)
    return response.json()["id"]


@pytest_asyncio.fixture
async def project_id(client: AsyncClient, db: AsyncSession, subject_id: int) -> int:
    """Create new project"""
    project["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    await set_admin(db, "test", False)
    return response.json()["id"]


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, db: AsyncSession, subject_id: int):
    project["subject_id"] = subject_id
    await set_admin(db, "test", False)
    response = await client.post("/api/projects/", json=project)
    assert response.status_code == 403  # Forbidden, not admin

    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    assert response.status_code == 201  # Created
    assert response.json()["name"] == project["name"]


@pytest.mark.asyncio
async def test_get_project(client: AsyncClient, project_id: int):
    response = await client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["name"] == project["name"]


@pytest.mark.asyncio
async def test_get_projects_for_subject(
    client: AsyncClient, subject_id: int, project_id: int
):
    response = await client.get(f"/api/subjects/{subject_id}/projects")
    assert response.status_code == 200
    assert len(response.json()["projects"]) == 1
    assert response.json()["projects"][0]["name"] == project["name"]


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient, db: AsyncSession, project_id: int):
    await set_admin(db, "test", False)
    response = await client.delete(f"/api/projects/{project_id}")
    await set_admin(db, "test", True)
    response = await client.delete(f"/api/projects/{project_id}")
    assert response.status_code == 200
    response = await client.get(f"/api/projects/{project_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_patch_project(client: AsyncClient, db: AsyncSession, project_id: int):
    await set_admin(db, "test", False)
    response = await client.patch(
        f"/api/projects/{project_id}", json={"name": "new name"}
    )
    assert response.status_code == 403
    await set_admin(db, "test", True)
    response = await client.patch(
        f"/api/projects/{project_id}", json={"name": "new name"}
    )
    assert response.status_code == 200
    response = await client.get(f"/api/projects/{project_id}")
    assert response.json()["name"] == "new name"
    response = await client.patch(
        f"/api/projects/{project_id}",
        json={"deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ")},
    )
    assert response.status_code == 200
    response = await client.get(f"/api/projects/{project_id}")
    assert response.json()["deadline"] == future_date.strftime(
        "%Y-%m-%dT%H:%M:%SZ")
    response = await client.patch(
        f"/api/projects/{project_id}",
        json={"description": "new description"},
    )
    assert response.status_code == 200
    response = await client.get(f"/api/projects/{project_id}")
    assert response.json()["description"] == "new description"


@pytest.mark.asyncio
async def test_is_visible_project(client: AsyncClient, db: AsyncSession, project_id: int):

    response = await client.get(f"/api/projects/{project_id}")
    subject_id = response.json()["subject_id"]

    await set_admin(db, "test", True)
    await client.patch(f"/api/projects/{project_id}", json={"is_visible": False})
    await set_admin(db, "test", False)

    response = await client.get(f"/api/projects/{project_id}")
    assert response.status_code == 404  # Not found as project is not visible

    response = await client.get(f"/api/subjects/{subject_id}/projects")
    assert len(response.json()["projects"]) == 0

    # Now privileged get request
    await make_instructor(subject_id, "test", db, client)
    response = await client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200

    response = await client.get(f"/api/subjects/{subject_id}/projects")
    assert len(response.json()["projects"]) == 1
