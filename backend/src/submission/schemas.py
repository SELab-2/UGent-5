from dataclasses import dataclass
from datetime import datetime
from typing import List

from fastapi import Form, UploadFile
from pydantic import BaseModel, ConfigDict, Field
from .models import Status, ResultType


class TestResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    type: ResultType
    value: str


class SubmissionBase(BaseModel):
    group_id: int


@dataclass
class SubmissionCreate:
    files: List[UploadFile]
    remarks: str | None = Form(None, min_length=1)


class Submission(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    files_uuid: str
    remarks: str | None
    id: int
    date: datetime
    project_id: int
    status: Status
    testresults: list[TestResult]


class File(BaseModel):
    filename: str = Field(min_length=1)
    media_type: str = Field(min_length=1)
