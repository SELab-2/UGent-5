from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from ..auth.exceptions import NotAuthorized
from ..subject.service import get_teachers


async def user_permission_validation(
    subject_id: int,
    user: User = Depends(get_authenticated_user),
    db: AsyncSession = Depends(get_db),
):
    if not user.is_admin:
        teachers = await get_teachers(db, subject_id)
        if not list(filter(lambda teacher: teacher.id == user.uid, teachers)):
            raise NotAuthorized()
