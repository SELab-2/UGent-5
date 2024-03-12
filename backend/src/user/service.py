from sqlalchemy.orm import Session

from . import models, schemas


async def get_by_id(db: Session, user_id: str) -> models.User:
    return db.get(models.User, user_id)


async def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def set_admin(db: Session, user_id: str, value: bool):
    user = await get_by_id(db, user_id)
    user.is_admin = value
    db.commit()
