from typing import List
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.subject.models import StudentSubject, Subject
from .exceptions import ProjectNotFound, TestsNotFound
from .models import Project, Requirement
from .schemas import ProjectCreate, ProjectList, ProjectUpdate
from ..docker_tests.docker_tests import build_docker_image, using_default_docker_image
from ..docker_tests.utils import write_and_unpack_files, tests_path, remove_test_files


async def create_project(db: AsyncSession, project_in: ProjectCreate) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=project_in.subject_id,
        description=project_in.description,
        is_visible=project_in.is_visible,
        capacity=project_in.capacity,
        requirements=[Requirement(**r.model_dump()) for r in project_in.requirements],
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_project(db: AsyncSession, project_id: int) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalars().first()


async def get_projects_by_user(db: AsyncSession, user_id: str) -> ProjectList:
    result = await db.execute(
        select(Project)
        .join(Subject, Project.subject_id == Subject.id)
        .join(StudentSubject, StudentSubject.c.subject_id == Subject.id)
        .where(StudentSubject.c.uid == user_id)
    )
    projects = result.scalars().unique().all()
    return ProjectList(projects=projects)


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
    if project_update.description is not None:
        project.description = project_update.description
    if project_update.is_visible is not None:
        project.is_visible = project_update.is_visible
    if project_update.requirements is not None:
        project.requirements = [Requirement(**r.model_dump())
                                for r in project_update.requirements]

    await db.commit()
    await db.refresh(project)
    return project


async def update_test_files(db: AsyncSession, project_id: int, test_files: List[UploadFile]):
    project = await get_project(db, project_id)

    if not project.test_files_uuid:
        uuid = str(uuid4())
    else:
        uuid = str(project.test_files_uuid)

    write_and_unpack_files(test_files, uuid)

    if not using_default_docker_image(uuid):
        # build custom docker image if dockerfile is present
        build_docker_image(tests_path(uuid), uuid)

    project.test_files_uuid = uuid
    await db.commit()
    await db.refresh(project)
    return project


async def delete_test_files(db: AsyncSession, project_id: int):
    project = await get_project(db, project_id)

    if not project.test_files_uuid:
        raise TestsNotFound

    remove_test_files(str(project.test_files_uuid))

    await db.delete(project)
    await db.commit()
