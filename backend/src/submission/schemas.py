from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .models import Status


class SubmissionBase(BaseModel):
    project_id: int


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: datetime
    group_id: int
    status: Status
