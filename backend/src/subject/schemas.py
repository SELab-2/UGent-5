from enum import Enum
from typing import Sequence
from pydantic import BaseModel, Field, ConfigDict


class SubjectBase(BaseModel):
    name: str = Field(min_length=1)


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class SubjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    as_teacher: Sequence[Subject]
    as_student: Sequence[Subject]
