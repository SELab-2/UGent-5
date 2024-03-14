import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.dependencies import get_async_db
from src.group.schemas import GroupCreate
from src.group.service import create_group
from src.user.service import set_admin
import pytest_asyncio


group_data = {'name': 'test group'}


@pytest_asyncio.fixture
async def group_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new group."""
    await set_admin(db, "test", True)
    response = await client.post("/api/projects/{project_id}/groups/", json=group_data)

    return response.json()["id"]


@pytest.mark.asyncio
async def test_get_group(client: AsyncClient, group_id: int):
    response = await client.get(f"/api/projects/{{project_id}}/groups/{group_id}")
    assert response.status_code == 200
    assert response.json()["id"] == group_data["id"]


@pytest.mark.asyncio
async def test_remove_user(client: AsyncClient, db: AsyncSession, group_id: int):
    await set_admin(db, "test", False)
    response = await client.delete(f"/api/projects/{{project_id}}/groups/{group_id}")
    assert response.status_code == 403  # Forbidden
    await set_admin(db, "test", True)
    response = await client.delete(f"/api/projects/{{project_id}}/groups/{group_id}")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_join_user(client: AsyncClient, db: AsyncSession, group_id: int):
    await set_admin(db, "test", False)
    response = await client.post(f"/api/projects/{{project_id}}/groups/{group_id}")
    assert response.status_code == 403  # Forbidden
    await set_admin(db, "test", True)
    response = await client.delete(f"/api/projects/{{project_id}}/groups/{group_id}")
    assert response.status_code == 200
