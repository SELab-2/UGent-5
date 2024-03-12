from typing import Any, AsyncGenerator, Generator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from .database import AsyncSessionLocal, SessionLocal


def get_db() -> Generator[Session, Any, None]:
    """Creates new database session per request, which is closed afterwards"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, Any]:
    """Creates new async database session per request, which is closed afterwards"""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
