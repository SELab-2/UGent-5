from pydantic import BaseModel


class TokenRequest(BaseModel):
    ticket: str
    returnUrl: str


class Token(BaseModel):
    token: str
    token_type: str
