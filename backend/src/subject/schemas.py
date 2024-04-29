from typing import Sequence, Optional

from pydantic import BaseModel, ConfigDict, Field


class SubjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str = Field(min_length=1)
    academic_year: Optional[int] = None


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):

    id: int


class SubjectList(BaseModel):
    subjects: Sequence[Subject]
    model_config = ConfigDict(from_attributes=True)
