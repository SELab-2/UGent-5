from pydantic import BaseModel, Field


class Userbase(BaseModel):
    id: str  # ugentID
    given_name: str


class UserCreate(Userbase):
    pass


class User(Userbase):
    is_admin: bool = Field(default=False)

    class Config:
        from_attributes = True
