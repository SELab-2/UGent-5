from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
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


class File(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uid: str
    filename: str = Field(min_length=1)
    content_type: str = Field(min_length=1)
    submission_id: int
