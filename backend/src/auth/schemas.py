from pydantic import BaseModel


class Token(BaseModel):
    token: str
    token_type: str


class TokenRequest(BaseModel):
    ticket: str
    returnUrl: str


class Authority(BaseModel):
    method: str
    authority: str
