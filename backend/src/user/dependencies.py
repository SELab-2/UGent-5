from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.dependencies import verify_jwt_token
from src.dependencies import get_async_db
from fastapi import Depends
from .schemas import User
from .exceptions import UserNotFound
from src.auth.exceptions import UnAuthenticated, NotAuthorized
import src.user.service as user_service


async def get_authenticated_user(
    user_id: str = Depends(verify_jwt_token), db: AsyncSession = Depends(get_async_db)
) -> User:
    """Get current logged in user"""
    if not user_id:
        raise UnAuthenticated()
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()

    return user


async def admin_user_validation(user: User = Depends(get_authenticated_user)):
    """Checks if user is an admin"""
    if not user.is_admin:
        raise NotAuthorized()


async def user_id_validation(user_id: str, db: AsyncSession = Depends(get_async_db)):
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise UserNotFound()
