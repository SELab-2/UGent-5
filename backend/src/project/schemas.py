from datetime import datetime
from typing import List, Optional, Sequence

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Requirement(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mandatory: bool  # True for mandatory False for prohibited
    value: str = Field(min_length=1)


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1)
    deadline: datetime
    description: str
    subject_id: int
    is_visible: bool = Field(default=True)
    capacity: int = Field(gt=0)
    requirements: List[Requirement] = []


class ProjectCreate(ProjectBase):
    pass

    # Check if deadline is not in the past
    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value


class Project(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    test_files_uuid: str | None


class ProjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    projects: Sequence[Project]


class UserProjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    as_instructor: Sequence[Project]
    as_student: Sequence[Project]


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    deadline: Optional[datetime] = None
    description: Optional[str] = None
    requirements: Optional[List[Requirement]] = None
    is_visible: Optional[bool] = None

    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value is not None and value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value
