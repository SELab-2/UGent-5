from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.service import set_admin

subject = {"name": "test subject"}
future_date = datetime.now(timezone.utc) + timedelta(weeks=1)
project = {
    "name": "test project",
    "subject_id": 0,  # temp needs to be filled in by actual subject id
    "deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "description": "test",
    "enroll_deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "requirements": []
}
group_data = {"team_name": "test group", "project_id": 0}


@pytest_asyncio.fixture
async def subject_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new subject"""
    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    return response.json()["id"]


@pytest_asyncio.fixture
async def project_id(client: AsyncClient, db: AsyncSession, subject_id: int):
    project["subject_id"] = subject_id
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    return response.json()["id"]


@pytest_asyncio.fixture
async def group_id(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data["project_id"] = project_id
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)
    return response.json()["id"]


@pytest.mark.asyncio
async def test_create_group(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data = {"team_name": "test group", "project_id": project_id}
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)
    assert response.status_code == 201  # Created
    assert response.json()["team_name"] == group_data["team_name"]


@pytest.mark.asyncio
async def test_get_group(client: AsyncClient, group_id: int):
    response = await client.get(f"/api/groups/{group_id}")
    assert response.status_code == 200
    assert response.json()["id"] == group_id


@pytest.mark.asyncio
async def test_join_user(client: AsyncClient, group_id: int):
    response = await client.post(f"/api/groups/{group_id}")
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_remove_user(client: AsyncClient, group_id: int):
    response = await client.post(f"/api/groups/{group_id}")
    response = await client.delete(f"/api/groups/{group_id}")
    assert response.status_code == 200
    response = await client.delete(f"/api/groups/{group_id}")
    assert response.status_code == 404
