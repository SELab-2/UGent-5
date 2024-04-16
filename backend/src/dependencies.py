from typing import Any, AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from .database import AsyncSessionLocal


async def get_async_db() -> AsyncGenerator[AsyncSession, Any]:
    """Creates new async database session per request, which is closed afterwards"""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.commit()
        await db.close()
