from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service


async def user_permission_validation(
        submission_id: int,
        user: User = Depends(get_authenticated_user),
        db: AsyncSession = Depends(get_async_db)
):
    if not user.is_admin:
        group = await service.get_group(db, submission_id)
        # TODO: check if group associated with the submission contains current user
        if not group:
            raise NotAuthorized()


async def get_group_id(user: User = Depends(get_authenticated_user)) -> int:
    """Get the group_id of the given subject for the currently authenticated user"""
    raise NotImplementedError()  # TODO:
