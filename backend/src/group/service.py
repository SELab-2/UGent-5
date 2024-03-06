from sqlalchemy.orm import Session
from . import models, schemas


async def get_group_by_id(db: Session, group_id: str) -> models.Group:
    return db.get(models.Group, group_id)


async def get_groups() -> list[models.Group]:
    pass


async def create_group(db: Session, group: schemas.GroupCreate) -> models.Group:
    db_group = models.Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


async def join_group():
    pass


async def leave_group():
    pass