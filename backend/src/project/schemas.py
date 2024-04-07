from datetime import datetime
from typing import Optional, Sequence, List

from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Requirement(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mandatory: bool  # True for mandatory False for prohibited
    value: str = Field(min_length=1)


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1)
    deadline: datetime
    description: str
    subject_id: int
    requirements: List[Requirement]
    test_files: List[UploadFile]

    # Check if deadline is not in the past
    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value


class Project(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    deadline: datetime
    description: str
    subject_id: int
    requirements: list[Requirement]
    test_files_uuid: str | None


class ProjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    projects: Sequence[Project]


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    deadline: Optional[datetime] = None
    description: Optional[str] = None
    requirements: Optional[List[Requirement]] = None

    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value is not None and value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value
