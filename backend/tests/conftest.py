from httpx import ASGITransport, AsyncClient
from sqlalchemy.orm import Session, sessionmaker
from src.auth.utils import create_jwt_token
from src.database import engine
from src.main import app
from src.dependencies import get_db
import pytest

from src.user.schemas import UserCreate
from src.user.service import create_user

connection = engine.connect()
trans = connection.begin()
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)


def get_db_override():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = get_db_override


@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.fixture
async def db():
    global trans
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        trans.rollback()
        trans = connection.begin()


@pytest.fixture
async def client(db: Session):
    token = create_jwt_token("test")

    await create_user(db, UserCreate(uid="test", given_name="tester", mail="test@test.test"))

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test", headers={"Authorization": f"Bearer {token.token}"}) as client:
        yield client


def pytest_sessionfinish():
    connection.close()
