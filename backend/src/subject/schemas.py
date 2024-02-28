from pydantic import BaseModel

class SubjectBase(BaseModel):
    name: str

class SubjectCreate():
    pass

class Subject(BaseModel):
    id: int

    class Config:
        from_attributes = True


