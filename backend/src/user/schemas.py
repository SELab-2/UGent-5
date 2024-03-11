from typing import Sequence

from pydantic import BaseModel, Field
from src.subject.schemas import Subject


class Userbase(BaseModel):
    uid: str  # ugentID
    given_name: str
    mail: str


class UserCreate(Userbase):
    pass


class User(Userbase):
    is_admin: bool = Field(default=False)

    class Config:
        from_attributes = True


class SubjectList(BaseModel):
    as_teacher: Sequence[Subject]
    as_student: Sequence[Subject]

    class Config:
        from_attributes = True
