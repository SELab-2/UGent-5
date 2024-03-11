from datetime import datetime
from pydantic import BaseModel
from .models import Status


class SubmissionBase(BaseModel):
    project_id: int


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    id: int
    date: datetime
    group_id: int
    status: Status

    class Config:
        from_attributes = True
