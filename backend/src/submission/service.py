
from sqlalchemy.orm import Session
from . import models


async def get_submisstion(db: Session, submission_id: int) -> models.Submission:
    return db.query(models.Submission).filter_by(id=submission_id).first()
