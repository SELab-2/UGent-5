
from sqlalchemy.orm import Session
from . import models, schemas


async def get_subject(db: Session, subject_id: int) -> models.Subject:
    return db.query(models.Subject).filter_by(id=subject_id).first()


async def create_subject(db: Session, subject: schemas.SubjectCreate) -> models.Subject:
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


async def remove_subject(db: Session, subject: schemas.Subject):
    db.delete(subject)
    db.commit()
