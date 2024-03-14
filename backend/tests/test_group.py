import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.group.schemas import GroupCreate
from src.group.service import create_group
from src.user.service import set_admin
import pytest_asyncio
from datetime import datetime, timezone, timedelta


subject = {'name': 'test subject'}


@pytest_asyncio.fixture
async def subject_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new subject"""
    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    return response.json()["id"]


@pytest_asyncio.fixture
async def project_id(client: AsyncClient, db: AsyncSession, subject_id: int):
    future_date = datetime.now(timezone.utc) + timedelta(weeks=1)
    project = {
        "name": "test project",
        "subject_id": subject_id,
        "deadline": future_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "description": "test",
    }
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/", json=project)
    print(response.status_code)
    print(response.json())
    return response.json()["id"]

@pytest.mark.asyncio
async def test_create_group(client: AsyncClient, db: AsyncSession, project_id: int) -> int:
    group_data = {
        'team_name': 'test group',
        'project_id': project_id
    }
    await set_admin(db, "test", True)
    response = await client.post(f"/api/projects/{project_id}/groups/", json=group_data)
    
    print(response.json())
    print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    return response.json()["id"]

# group_data = {
#          'team_name': 'test group',
#          'project_id': project_id
#      }

@pytest.mark.asyncio
async def test_get_group(client: AsyncClient, group_id: int):
    response = await client.get(f"/api/projects/{project_id}/groups/{group_id}")
    assert response.status_code == 200
    assert response.json()["id"] == group_id


@pytest.mark.asyncio
async def test_remove_user(client: AsyncClient, db: AsyncSession, group_id: int):
    await set_admin(db, "test", False)
    response = await client.delete(f"/api/projects/{project_id}/groups/{group_id}")
    assert response.status_code == 403  # Forbidden
    await set_admin(db, "test", True)
    response = await client.delete(f"/api/projects/{project_id}/groups/{group_id}")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_join_user(client: AsyncClient, db: AsyncSession, group_id: int):
    await set_admin(db, "test", False)
    response = await client.post(f"/api/projects/{project_id}/groups/{group_id}")
    assert response.status_code == 403  # Forbidden
    await set_admin(db, "test", True)
    response = await client.post(f"/api/projects/{project_id}/groups/{group_id}")
    assert response.status_code == 200
