import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from src.config import CONFIG

from .exceptions import UnAuthenticated


def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> str:
    """
    Verify the JWT token and return the user_id
    Args:
        credentials (HTTPAuthorizationCredentials): The credentials from the request
    Returns:
        str: The user_id
    Raises:
        UnAuthenticated: If the token is invalid or expired
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            CONFIG.secret_key,
            algorithms=[CONFIG.algorithm],
            options={"require": ["exp", "sub"], "verify_signature": True},
        )
        user_id = payload["sub"]
        return user_id
    except (jwt.ExpiredSignatureError, jwt.MissingRequiredClaimError):
        # Token is expired or no expiration time is set
        raise UnAuthenticated
    except jwt.InvalidTokenError:
        # Token is invalid
        raise UnAuthenticated
