from datetime import datetime
from pydantic import BaseModel
from .models import Status


class SubmissionBase(BaseModel):
    date: datetime
    status: Status
    group_id: int
    project_id: int


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    id: int

    class Config:
        from_attributes = True
