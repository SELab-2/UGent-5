from typing import Sequence

from pydantic import BaseModel, ConfigDict, Field
from src.subject.schemas import Subject


class Userbase(BaseModel):
    uid: str  # ugentID
    given_name: str
    mail: str


class UserCreate(Userbase):
    pass


class UserSimple(Userbase):
    pass


class User(Userbase):
    model_config = ConfigDict(from_attributes=True)
    is_admin: bool = Field(default=False)


class UserSubjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    as_teacher: Sequence[Subject]
    as_student: Sequence[Subject]
