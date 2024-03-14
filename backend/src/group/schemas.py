from typing import List

from pydantic import BaseModel, Field

from src.user.schemas import User


class Groupbase(BaseModel):
    project_id: int
    score: int = 0
    team_name: str = Field(min_length=1)


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    id: int


class GroupPreview(Group):
    memberlist: List[User]

    class Config:
        from_attributes = True
