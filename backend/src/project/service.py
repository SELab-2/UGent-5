from typing import Sequence

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.subject.models import InstructorSubject, StudentSubject, Subject
from datetime import datetime, timezone

from .exceptions import ProjectNotFound
from .models import Project, Requirement
from .schemas import ProjectCreate, ProjectList, ProjectUpdate


async def create_project(db: AsyncSession, project_in: ProjectCreate) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=project_in.subject_id,
        description=project_in.description,
        is_visible=project_in.is_visible,
        capacity=project_in.capacity,
        requirements=[Requirement(**r.model_dump())
                      for r in project_in.requirements],
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_project(db: AsyncSession, project_id: int) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalars().first()


async def get_projects_by_user(db: AsyncSession, user_id: str) -> tuple[Sequence[Project], Sequence[Project]]:
    student_result = await db.execute(
        select(Project)
        .join(Subject, Project.subject_id == Subject.id)
        .join(StudentSubject, StudentSubject.c.subject_id == Subject.id)
        .where(StudentSubject.c.uid == user_id)
    )
    instructor_result = await db.execute(
        select(Project)
        .join(Subject, Project.subject_id == Subject.id)
        .join(InstructorSubject, InstructorSubject.c.subject_id == Subject.id)
        .where(InstructorSubject.c.uid == user_id)
    )
    return student_result.scalars().unique().all(), instructor_result.scalars().unique().all()


async def get_projects_for_subject(db: AsyncSession, subject_id: int) -> ProjectList:
    result = await db.execute(select(Project).where(Project.subject_id == subject_id))
    projects = result.scalars().unique().all()
    return ProjectList(projects=projects)


async def delete_project(db: AsyncSession, project_id: int):
    result = await db.execute(select(Project).filter_by(id=project_id))
    project = result.scalars().first()
    if project:
        await db.delete(project)
        await db.commit()


async def delete_requirements_for_project(db: AsyncSession, project_id: int):
    await db.execute(delete(Requirement).where(Requirement.project_id == project_id))


async def update_project(
    db: AsyncSession, project_id: int, project_update: ProjectUpdate
) -> Project:
    result = await db.execute(select(Project).filter_by(id=project_id))
    project = result.scalars().first()
    if not project:
        raise ProjectNotFound

    if project_update.name is not None:
        project.name = project_update.name
    if project_update.deadline is not None:
        project.deadline = project_update.deadline
    if project_update.publish_date is not None:
        project.publish_date = project_update.publish_date
    if project_update.enroll_deadline is not None:
        project.enroll_deadline = project.enroll_deadline
    if project_update.description is not None:
        project.description = project_update.description
    if project_update.requirements is not None:
        await delete_requirements_for_project(db, project_id)
        project.requirements = [Requirement(**r.model_dump())
                                for r in project_update.requirements]

    await db.commit()
    await db.refresh(project)
    return project


async def update_test_files(db: AsyncSession, project_id: int, uuid: str | None) -> Project:
    project = await get_project(db, project_id)

    project.test_files_uuid = uuid
    await db.commit()
    await db.refresh(project)
    return project
