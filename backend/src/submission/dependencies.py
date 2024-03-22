from typing import Sequence

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.exceptions import NotAuthorized
from src.dependencies import get_async_db
from src.group.service import get_teachers_by_group, get_users_by_group
from src.submission.exceptions import SubmissionNotFound
from src.submission.schemas import SubmissionCreate
from src.user.dependencies import get_authenticated_user
from src.user.schemas import User

from . import service


async def group_id_validation(group_id: int,
                              user: User = Depends(get_authenticated_user),
                              db: AsyncSession = Depends(get_async_db)):
    if not user.is_admin:
        # check if is instructor
        # should be sequence
        instructors: Sequence[User] = await get_teachers_by_group(db, group_id)
        for i in instructors:
            if i.uid == user.uid:
                return
        users = await get_users_by_group(db, group_id)
        if not any(user.uid == u.uid for u in users):
            raise NotAuthorized("Not in group nor instructor or admin")


async def create_permission_validation(
        submission: SubmissionCreate,
        user: User = Depends(get_authenticated_user),
        db: AsyncSession = Depends(get_async_db)
):
    await group_id_validation(submission.group_id, user, db)


async def retrieve_submission(
        submission_id: int,
        user: User = Depends(get_authenticated_user),
        db: AsyncSession = Depends(get_async_db)
):
    submission = await service.get_submission(db, submission_id)
    if not submission:
        raise SubmissionNotFound()

    instructors = list(await get_teachers_by_group(db, submission.group_id))
    group_users = list(await get_users_by_group(db, submission.group_id))

    if not any(user.uid == u.uid for u in instructors + group_users) and not user.is_admin:
        raise NotAuthorized()

    return submission
