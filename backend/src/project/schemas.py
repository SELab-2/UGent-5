from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1)
    deadline: datetime
    description: str

    # Check if deadline is not in the past
    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    deadline: datetime
    description: str
    subject_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    deadline: Optional[datetime] = None
    description: Optional[str] = None

    @field_validator("deadline")
    def validate_deadline(cls, value: datetime) -> datetime:
        if value is not None and value < datetime.now(value.tzinfo):
            raise ValueError("The deadline cannot be in the past")
        return value
