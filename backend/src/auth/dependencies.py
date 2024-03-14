import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import CONFIG
from src.dependencies import get_async_db
import src.user.service as user_service

from .exceptions import UnAuthenticated


def jwt_token_validation(
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
        raise UnAuthenticated()
    except jwt.InvalidTokenError:
        # Token is invalid
        raise UnAuthenticated()


async def authentication_validation(
    user_id: str = Depends(jwt_token_validation), db: AsyncSession = Depends(get_async_db)
):
    """
    Verify if the user is authenticated
    """
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UnAuthenticated()
