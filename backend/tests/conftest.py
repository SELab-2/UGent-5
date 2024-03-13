from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from src.auth.utils import create_jwt_token
from src.database import async_engine
from src.main import app
from src.dependencies import get_async_db
import pytest
import asyncio
import pytest_asyncio

from src.user.schemas import UserCreate
from src.user.service import create_user

connection = None
trans = None
TestingSessionLocal = None

async def get_session() -> AsyncSession:
    global TestingSessionLocal, connection, trans
    if TestingSessionLocal is None:
        connection = await async_engine.connect()
        trans = await connection.begin()

        TestingSessionLocal = async_sessionmaker(connection, autoflush=False)
        return TestingSessionLocal()
    else:
        return TestingSessionLocal()


async def get_db_override():
    db = await get_session()
    try:
        yield db
    finally:
        await db.close()

app.dependency_overrides[get_async_db] = get_db_override


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def db():
    global trans, connection
    db = await get_session()
    try:
        yield db
    finally:
        if trans is not None and connection is not None:
            await db.close()
            await trans.rollback()
            trans = await connection.begin()

@pytest_asyncio.fixture
async def client(db: AsyncSession):
    token = create_jwt_token("test")

    await create_user(db, UserCreate(uid="test", given_name="tester", mail="test@test.test"))

    transport = ASGITransport(app=app)  # type: ignore
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": f"Bearer {token.token}"}) as client:
        yield client
