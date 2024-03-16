from typing import Sequence

from pydantic import BaseModel, ConfigDict, Field


class SubjectBase(BaseModel):
    name: str = Field(min_length=1)


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class SubjectList(BaseModel):
    subjects: Sequence[Subject]
    model_config = ConfigDict(from_attributes=True)
