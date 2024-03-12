from typing import List, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models
from .exceptions import ProjectNotFoundException
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate


async def create_project(db: AsyncSession, project_in: ProjectCreate, subject_id: int) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=subject_id,
        description=project_in.description
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_project(db: AsyncSession, project_id: int) -> models.Project:
    result = await db.execute(select(models.Project).filter(models.Project.id == project_id))
    return result.scalars().first()


async def get_projects_for_subject(db: AsyncSession, subject_id: int) -> Sequence[models.Project]:
    result = await db.execute(select(models.Project).filter_by(subject_id=subject_id))
    projects = result.scalars().all()
    return projects


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
        raise ProjectNotFoundException()

    if project_update.name is not None:
        project.name = project_update.name
    if project_update.deadline is not None:
        project.deadline = project_update.deadline
    if project_update.description is not None:
        project.description = project_update.description

    await db.commit()
    await db.refresh(project)
    return project
