from pydantic import BaseModel, ConfigDict

class Userbase(BaseModel):
    uid: str
    given_name: str
    surname: str

class UserCreate():
    pass

class User(BaseModel):
    id: int

    class Config:
        from_attributes = True
