from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.submission.exceptions import SubmissionNotFound
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User
from src.group.utils import has_group_privileges

from . import service


async def group_permission_validation(group_id: int,
                                      user: User = Depends(get_authenticated_user),
                                      db: AsyncSession = Depends(get_async_db)):
    if not await has_group_privileges(group_id, user, db):
        raise NotAuthorized()


async def retrieve_submission(
        submission_id: int,
        user: User = Depends(get_authenticated_user),
        db: AsyncSession = Depends(get_async_db)
):
    submission = await service.get_submission(db, submission_id)
    if not submission:
        raise SubmissionNotFound()

    await group_permission_validation(submission.group_id, user, db)

    return submission
