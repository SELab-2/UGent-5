from sqlalchemy.ext.asyncio import AsyncSession
from src.user.schemas import User

from src.subject.service import is_instructor

async def has_subject_privileges(
    subject_id: int,
    user: User,
    db: AsyncSession,
) -> bool:
    return user.is_admin or user.is_teacher or await is_instructor(db,subject_id,user.uid)

