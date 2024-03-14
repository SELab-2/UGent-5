from typing import Sequence

from pydantic import BaseModel, ConfigDict, Field
from src.user.schemas import User


class Groupbase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_id: int
    score: int = 0
    team_name: str = Field(min_length=1)


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    id: int


class GroupPreview(Group):
    memberlist: Sequence[User]

    class Config:
        from_attributes = True


class GroupList(BaseModel):
    groups: Sequence[Group]
