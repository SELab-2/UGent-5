from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models
from .exceptions import ProjectNotFoundException
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate


async def create_project(db: AsyncSession, project_in: ProjectCreate, user_id: str) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=project_in.subject_id,
        description=project_in.description
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_project(db: AsyncSession, project_id: int) -> models.Project:
    result = await db.execute(select(models.Project).filter(models.Project.id == project_id))
    return result.scalars().first()


async def get_projects_for_subject(db: AsyncSession, subject_id: int) -> List[models.Project]:
    result = await db.execute(select(models.Project).filter(models.Project.subject_id == subject_id))
    projects = result.scalars().all()
    return list(projects)  # Explicitly convert to list


async def delete_project(db: AsyncSession, project_id: int):
    result = await db.execute(select(models.Project).filter(models.Project.id == project_id))
    project = result.scalars().first()
    if project:
        await db.delete(project)
        await db.commit()


async def update_project(db: AsyncSession, project_id: int, project_update: ProjectUpdate) -> Project:
    result = await db.execute(select(Project).filter(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        # Handle the case where the project doesn't exist
        raise ProjectNotFoundException()

    # Update fields only if they're provided in the update payload
    if project_update.name is not None:
        project.name = project_update.name
    if project_update.deadline is not None:
        project.deadline = project_update.deadline
    if project_update.subject_id is not None:
        project.subject_id = project_update.subject_id
    if project_update.description is not None:
        project.description = project_update.description

    await db.commit()
    await db.refresh(project)
    return project
