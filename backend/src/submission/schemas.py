from datetime import datetime
from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field
from .models import Status


class SubmissionBase(BaseModel):
    group_id: int


class Submission(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    files_uuid: str
    id: int
    date: datetime
    project_id: int
    status: Status


class File(BaseModel):
    filename: str = Field(min_length=1)
    media_type: str = Field(min_length=1)
