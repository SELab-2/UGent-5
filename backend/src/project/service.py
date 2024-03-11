from sqlalchemy.orm import Session
from . import models, schemas
from .exceptions import ProjectNotFoundException
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate


def create_project(db: Session, project_in: ProjectCreate, user_id: str) -> Project:
    # SQLAlchemy does magic that Pyright doesn't understand. Using type: ignore
    new_project = Project(
        name=project_in.name,  # type: ignore
        deadline=project_in.deadline,  # type: ignore
        subject_id=project_in.subject_id,  # type: ignore
        description=project_in.description  # type: ignore
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

async def get_project(db: Session, project_id: int) -> models.Project:
    return db.query(models.Project).filter(models.Project.id == project_id).first()


async def get_projects_for_subject(db: Session, subject_id: int) -> list[models.Project]:
    projects = (
        db.query(models.Project)
        .filter(models.Project.subject_id == subject_id)
        .all()
    )
    return projects


async def delete_project(db: Session, project_id: int):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()


async def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
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

    db.commit()
    db.refresh(project)
    return project
