from typing import Sequence

from pydantic import BaseModel, ConfigDict, Field


class SubjectBase(BaseModel):
    name: str = Field(min_length=1)


class SubjectCreate(SubjectBase):
    pass

#can be used to add a teacher or student to a subject
class AddUserToSubject(BaseModel):
    uid: str


class Subject(SubjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class SubjectList(BaseModel):
    subjects: Sequence[Subject]
    model_config = ConfigDict(from_attributes=True)


class SubjectStudentCreate(BaseModel):
    user_id: str
