from sqlalchemy.orm import Session
from . import models

async def get_by_id(db: Session, user_id: int) -> models.User:
    return db.get(models.User,user_id)
