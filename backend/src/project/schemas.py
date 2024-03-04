from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, validator

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1)
    deadline: date
    subject_id: int
    description: str

    # Check if deadline is not in the past
    @validator('deadline', pre=True, always=True)
    def validate_deadline(cls, value):
        if value < date.today():
            raise ValueError('The deadline cannot be in the past')
        return value

class ProjectResponse(BaseModel):
    id: int
    name: str
    deadline: date
    subject_id: int
    description: str

    class Config:
        orm_mode = True

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    deadline: Optional[date] = None
    description: Optional[str] = None

