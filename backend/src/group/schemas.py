from pydantic import BaseModel, Field
from typing import Sequence


class Groupbase(BaseModel):
    project_id: int
    score: int


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    id: int
    team_name: str = Field(min_length=1)


class GroupJoin(Groupbase):  # TODO needed?
    pass


class GroupLeave(Groupbase):  # TODO needed?
    pass


class GroupList(BaseModel):
    pass
