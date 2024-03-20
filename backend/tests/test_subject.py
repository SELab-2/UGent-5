import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.user.schemas import UserCreate
from src.user.service import create_user, set_admin, set_teacher

subject = {"name": "test_subject"}


@pytest_asyncio.fixture
async def subject_id(client: AsyncClient, db: AsyncSession) -> int:
    """Create new subject"""
    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    return response.json()["id"]


@pytest.mark.asyncio
async def test_create_subject(client: AsyncClient, db: AsyncSession):
    await set_admin(db, "test", False)
    response = await client.post("/api/subjects/", json=subject)
    assert response.status_code == 403  # Forbidden, not admin

    await set_admin(db, "test", True)
    response = await client.post("/api/subjects/", json=subject)
    assert response.status_code == 201  # Created
    assert response.json()["name"] == subject["name"]


@pytest.mark.asyncio
async def test_get_subject(client: AsyncClient, subject_id: int):
    response = await client.get(f"/api/subjects/{subject_id}")
    assert response.status_code == 200
    assert response.json()["name"] == subject["name"]


@pytest.mark.asyncio
async def test_create_teacher(client: AsyncClient, db: AsyncSession, subject_id: int):
    await set_admin(db, "test", False)
    response = await client.post(
        f"/api/subjects/{subject_id}/teachers", json={"uid": "test"}
    )
    assert response.status_code == 403  # Forbidden

    await set_admin(db, "test", True)
    response = await client.post(
        f"/api/subjects/{subject_id}/teachers", json={"uid": "test"}
    )
    print(response.json())
    assert response.status_code == 201

    await create_user(
        db, UserCreate(uid="test2", given_name="tester", mail="test@test.test")
    )
    await set_admin(db, "test", False)
    await set_teacher(db, "test", True)
    response = await client.post(
        f"/api/subjects/{subject_id}/teachers", json={"uid": "test"}
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_get_teachers(client: AsyncClient, subject_id: int, db: AsyncSession):
    await set_admin(db, "test", True)
    # create teacher
    await create_user(
        db, UserCreate(uid="get_test", given_name="teacher",
                       mail="blabla@gmail.com")
    )
    await client.post(
        f"/api/subjects/{subject_id}/teachers", json={"uid": "get_test"}
    )
    response = await client.get(f"/api/subjects/{subject_id}/teachers")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["uid"] == "get_test"


@pytest.mark.asyncio
async def test_get_subjects(client: AsyncClient, subject_id: int):
    # await client.post(f"/api/subjects/{subject_id}/teachers", params={'user_id': 'test'})
    response2 = await client.get("/api/subjects/")
    assert response2.status_code == 200
    assert len(response2.json()) == 1


@pytest.mark.asyncio
async def test_delete_subject(client: AsyncClient, db: AsyncSession, subject_id: int):
    await set_admin(db, "test", False)
    response2 = await client.delete(f"/api/subjects/{subject_id}")
    assert response2.status_code == 403  # Forbidden
    await set_admin(db, "test", True)
    response3 = await client.delete(f"/api/subjects/{subject_id}")
    assert response3.status_code == 200

    response4 = await client.get(f"/api/subjects/{subject_id}")
    assert response4.status_code == 404  # Not Found


@pytest.mark.asyncio
async def test_patch_subject(client: AsyncClient, db: AsyncSession, subject_id: int):
    await set_admin(db, "test", False)
    response = await client.patch(
        f"/api/subjects/{subject_id}", json={"name": "new name"}
    )
    assert response.status_code == 403
    await set_admin(db, "test", True)
    response = await client.patch(
        f"/api/subjects/{subject_id}", json={"name": "new name"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "new name"


@pytest.mark.asyncio
async def test_enroll_student_into_course(client: AsyncClient, db: AsyncSession, subject_id: int):
    await set_admin(db, "test", True)
    response = await client.post(
        f"/api/subjects/{subject_id}/students", json={"uid": "test"}
    )
    assert response.status_code == 201

    # check if actually enrolled now:
    response = await client.get(f"/api/subjects/{subject_id}/students")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["uid"] == "test"


@pytest.mark.asyncio
async def test_get_students(client: AsyncClient, db: AsyncSession, subject_id: int):
    # enroll student
    await create_user(
        db, UserCreate(uid="get_test", given_name="tester",
                       mail="blabla@gmail.com")
    )
    await set_admin(db, "test", True)
    response = await client.post(
        f"/api/subjects/{subject_id}/students", json=({"uid": "get_test"})
    )
    assert response.status_code == 201
    await set_admin(db, "test", False)
    response = await client.get(f"/api/subjects/{subject_id}/students")
    assert response.status_code == 200
    print(response.json())
    assert len(response.json()) == 1
    assert response.json()[0]["uid"] == "get_test"


@pytest.mark.asyncio
async def test_delete_student(client: AsyncClient, db: AsyncSession, subject_id: int):
    # Enroll student
    user_uid = "get_test"  # Keep the user UID for further assertions
    await create_user(
        db, UserCreate(uid=user_uid, given_name="tester",
                       mail="blabla@gmail.com")
    )
    await client.post(
        # Use path parameters
        f"/api/subjects/{subject_id}/students/{user_uid}"
    )

    # Try to delete the student without admin privileges
    await set_admin(db, "test", False)
    # Use path parameters
    response = await client.delete(f"/api/subjects/{subject_id}/students/{user_uid}")
    assert response.status_code == 403

    # Delete the student with admin privileges
    await set_admin(db, "test", True)
    # Use path parameters
    response = await client.delete(f"/api/subjects/{subject_id}/students/{user_uid}")
    assert response.status_code == 200

    # Check if the student has been deleted
    response = await client.get(f"/api/subjects/{subject_id}/students")
    assert response.status_code == 200
    students = response.json()
    assert not any(
        student['uid'] == user_uid for student in students), "The student should have been deleted."
    assert len(students) == 0, "There should be no students in the course."
