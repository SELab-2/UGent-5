
from sqlalchemy.orm import Session
from . import models
from . import schemas


async def get_submission(db: Session, submission_id: int) -> models.Submission:
    return db.query(models.Submission).filter_by(id=submission_id).first()


async def get_group(db: Session, submission_id: int):
    pass


async def create_submission(db: Session,
                            submission: schemas.SubmissionCreate,
                            group_id: int
                            ) -> models.Submission:
    db_submission = models.Submission(
        project_id=submission.project_id, group_id=group_id)
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission


async def delete_submission(db: Session, submission_id: int):
    db.query(models.Submission).filter_by(id=submission_id).delete()
    db.commit()
