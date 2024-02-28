from .database import SessionLocal

def get_db():
    """Creates new database session per request, which is closed afterwards"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
