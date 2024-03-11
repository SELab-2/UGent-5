from pydantic import BaseModel, Field, ConfigDict


class Userbase(BaseModel):
    uid: str  # ugentID
    given_name: str
    mail: str


class UserCreate(Userbase):
    pass


class User(Userbase):
    model_config = ConfigDict(from_attributes=True)

    is_admin: bool = Field(default=False)
