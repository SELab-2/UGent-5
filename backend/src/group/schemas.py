from typing import Sequence

from pydantic import BaseModel, ConfigDict
from src.user.schemas import User


class Groupbase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_id: int
    score: int = 0


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    id: int
    num: int
    members: list[User]


class GroupPreview(Group):
    memberlist: Sequence[User]

    class Config:
        from_attributes = True


class GroupList(BaseModel):
    groups: Sequence[Group]
