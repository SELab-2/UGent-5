from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .models import Status


class Testresult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    # true if test succeeded, false if not
    succeeded: bool
    value: str = Field(min_length=1)


class SubmissionBase(BaseModel):
    group_id: int


class Submission(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    files_uuid: str
    id: int
    date: datetime
    project_id: int
    status: Status
    testresults: list[Testresult]


class File(BaseModel):
    filename: str = Field(min_length=1)
    media_type: str = Field(min_length=1)
