from pydantic import BaseModel, Field

class Groupbase(BaseModel):
    id: str
    team_name: str = Field(min_length=1)
    score: int
    project_id: int


class GroupCreate(Groupbase):
    pass


class Group(Groupbase):
    pass


class GroupJoin(Groupbase):
    pass


class GroupLeave(Groupbase):
    pass


class GroupList(BaseModel):
    pass