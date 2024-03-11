import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from src.user.schemas import UserCreate

from src.user.service import set_admin
from src.user.service import create_user

subject = {'name': 'test subject'}

@pytest.fixture
async def subject_id(client: AsyncClient, db: Session) -> int:
    """Create new subject"""
    await set_admin(db,"test", True)
    response = await client.post("/api/subjects/", json=subject)
    return response.json()["id"]

@pytest.mark.anyio
async def test_create_subject(client: AsyncClient, db: Session):

    await set_admin(db,"test",False)
    response = await client.post("/api/subjects/", json=subject)
    assert response.status_code == 403 # Forbidden, not admin

    await set_admin(db,"test", True)
    response = await client.post("/api/subjects/", json=subject)
    assert response.status_code == 201 # Created
    assert response.json()["name"] == subject["name"]


@pytest.mark.anyio
async def test_get_subject(client: AsyncClient, subject_id: int):

    response = await client.get(f"/api/subjects/{subject_id}")
    assert response.status_code == 200
    assert response.json()["name"] == subject["name"]

@pytest.mark.anyio
async def test_create_teacher(client: AsyncClient, db: Session, subject_id: int):

    await set_admin(db,"test", False)
    response2 = await client.post(f"/api/subjects/{subject_id}/teachers", params={'user_id': 'test'})
    assert response2.status_code == 403 # Forbidden

    await set_admin(db,"test", True)
    response2 = await client.post(f"/api/subjects/{subject_id}/teachers", params={'user_id': 'test'})
    assert response2.status_code == 201

    await set_admin(db,"test", False)
    await create_user(db,UserCreate(uid="test2",given_name="tester", mail="test@test.test"))
    response2 = await client.post(f"/api/subjects/{subject_id}/teachers", params={'user_id': 'test2'})
    assert response2.status_code == 201 # Success because we are teacher now

@pytest.mark.anyio
async def test_get_subjects(client: AsyncClient, subject_id: int):
    await client.post(f"/api/subjects/{subject_id}/teachers", params={'user_id': 'test'})
    response2 = await client.get("/api/subjects/")
    assert response2.status_code == 200
    assert len(response2.json()["as_teacher"]) == 1


@pytest.mark.anyio
async def test_delete_subject(client: AsyncClient, db: Session, subject_id: int):
    await set_admin(db,"test", False)
    response2 = await client.delete(f"/api/subjects/{subject_id}")
    assert response2.status_code == 403 #Forbidden
    await set_admin(db,"test", True)
    response3 = await client.delete(f"/api/subjects/{subject_id}")
    assert response3.status_code == 200

    response4 = await client.get(f"/api/subjects/{subject_id}")
    assert response4.status_code == 404 # Not Found
