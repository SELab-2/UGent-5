
from sqlalchemy.ext.asyncio import AsyncSession
from src.group.dependencies import retrieve_group
from src.project.dependencies import retrieve_project
from src.subject.utils import has_subject_privileges
from src.user.schemas import User


async def has_group_privileges(
    group_id: int,
    user: User,
    db: AsyncSession
) -> bool:
    group = await retrieve_group(group_id, db)
    project = await retrieve_project(group.project_id, user, db)
    return await has_subject_privileges(project.subject_id, user, db) or user in group.members
