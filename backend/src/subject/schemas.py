from enum import Enum
from typing import Sequence
from pydantic import BaseModel, Field


class SubjectBase(BaseModel):
    name: str = Field(min_length=1)


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):
    id: int

    class Config:
        from_attributes = True


class SubjectList(BaseModel):
    as_teacher: Sequence[Subject]
    as_student: Sequence[Subject]

    class Config:
        from_attributes = True
