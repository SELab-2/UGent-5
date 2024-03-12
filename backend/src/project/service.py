from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.subject.models import StudentSubject, Subject

from .exceptions import ProjectNotFoundException
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate


async def create_project(
    db: AsyncSession, project_in: ProjectCreate, subject_id: int
) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=subject_id,
        description=project_in.description,
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_project(db: AsyncSession, project_id: int) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalars().first()


async def get_projects_by_user(db: AsyncSession, user_id: str) -> Sequence[Project]:
    result = await db.execute(
        select(Project)
        .join(Subject, Project.subject_id == Subject.id)
        .join(StudentSubject, StudentSubject.c.subject_id == Subject.id)
        .where(StudentSubject.c.uid == user_id)
    )
    return result.scalars().all()


async def get_projects_for_subject(
    db: AsyncSession, subject_id: int
) -> Sequence[Project]:
    result = await db.execute(select(Project).filter_by(subject_id=subject_id))
    projects = result.scalars().all()
    return projects


async def delete_project(db: AsyncSession, project_id: int):
    result = await db.execute(select(Project).filter_by(id=project_id))
    project = result.scalars().first()
    if project:
        await db.delete(project)
        await db.commit()


async def update_project(
    db: AsyncSession, project_id: int, project_update: ProjectUpdate
) -> Project:
    result = await db.execute(select(Project).filter_by(id=project_id))
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