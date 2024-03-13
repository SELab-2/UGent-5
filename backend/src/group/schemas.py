from pydantic import BaseModel, Field
from ..user.schemas import User
from typing import List


class Groupbase(BaseModel):
    project_id: int
    score: int


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    id: int
    team_name: str = Field(min_length=1)


class GroupPreview(Group):
    memberlist: List[User]

    class Config:
        from_attributes = True
