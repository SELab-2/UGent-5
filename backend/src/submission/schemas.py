from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .models import Status


class SubmissionBase(BaseModel):
    group_id: int


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: datetime
    project_id: int
    status: Status
