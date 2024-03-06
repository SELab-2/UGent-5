import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.config import CONFIG
from .exceptions import NotAuthorized


def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> str:
    scheme = credentials.scheme
    if not scheme.lower() == "bearer":
        raise NotAuthorized
    try:
        payload = jwt.decode(
            credentials.credentials, CONFIG.secret_key, algorithms=[CONFIG.algorithm]
        )
        user_id = payload["sub"]
        return user_id
    except jwt.PyJWTError:
        raise NotAuthorized
