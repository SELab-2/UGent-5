from datetime import datetime, timedelta, timezone

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.utils import create_jwt_token
from src.group.exceptions import MaxCapacity
from src.user.schemas import UserCreate
from src.user.service import create_user, set_admin, set_teacher

# Import fixtures
from tests.test_subject import make_instructor, subject_id
from tests.test_project import project_id



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
    "requirements": []
}
group_data = {"team_name": "test group", "project_id": 0}


@pytest_asyncio.fixture
async def group_id(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data["project_id"] = project_id
    await set_admin(db, "test", True)
    response = await client.post("/api/groups/", json=group_data)
    await set_admin(db, "test", False)
    return response.json()["id"]



@pytest.mark.asyncio
async def test_create_group(client: AsyncClient, db: AsyncSession, project_id: int):
    group_data = {"team_name": "test group", "project_id": project_id}
    response = await client.post("/api/groups/", json=group_data)
    assert response.status_code == 403

    await set_teacher(db, "test", True)
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

    response = await client.post(f"/api/groups/{group_id}")
    assert response.status_code == 403 # Already in group error


@pytest.mark.asyncio
async def test_remove_user(client: AsyncClient, group_id: int):
    response = await client.post(f"/api/groups/{group_id}")
    response = await client.delete(f"/api/groups/{group_id}")
    assert response.status_code == 200
    response = await client.delete(f"/api/groups/{group_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_submissions(client: AsyncClient, group_id: int, db: AsyncSession):
    response = await client.get(f"/api/groups/{group_id}/submissions")
    assert response.status_code == 403 # No permission

    await client.post(f"/api/groups/{group_id}") # Join group

    response = await client.get(f"/api/groups/{group_id}/submissions")
    assert response.status_code == 200
    assert response.json() == []

    response = await client.delete(f"/api/groups/{group_id}")

    response = await client.get(f"/api/groups/{group_id}/submissions")
    assert response.status_code == 403 # No permission again

    response = await client.get(f"/api/groups/{group_id}") # Get group
    response = await client.get(f"/api/projects/{response.json()['project_id']}") # Get project
    await make_instructor(response.json()["subject_id"], "test", db, client)

    response = await client.get(f"/api/groups/{group_id}/submissions")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_capacity_group(client: AsyncClient, group_id: int, db:  AsyncSession):

    await client.post(f"/api/groups/{group_id}") # Join group

    username = "test2"
    token = create_jwt_token(username)
    await create_user(db, UserCreate(uid=username, given_name="tester", mail="test@test.test"))

    response = await client.post(f"/api/groups/{group_id}", headers={"Authorization": f"Bearer {token.token}"}) # Join group
    assert response.status_code == 403
    assert response.json()["detail"] == MaxCapacity().detail


