from enum import Enum
from pydantic import BaseModel, Field


class SubjectBase(BaseModel):
    name: str = Field(min_length=1)


class SubjectCreate(SubjectBase):
    pass


class TaskEnum(str, Enum):
    student = "student"
    teacher = "teacher"
    unknown = "unknown"


class Subject(SubjectBase):
    id: int
    task: TaskEnum = Field(
        default=TaskEnum.unknown,
        description="Specifies if current user is teacher or student of this subject",
    )

    class Config:
        from_attributes = True
