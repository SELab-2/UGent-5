from .database import SessionLocal, AsyncSessionLocal


def get_db():
    """Creates new database session per request, which is closed afterwards"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Creates new async database session per request, which is closed afterwards"""
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
