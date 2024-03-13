from .database import AsyncSessionLocal


async def get_async_db():
    """Creates new async database session per request, which is closed afterwards"""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
