from sqlalchemy.orm import Session
from . import models, schemas
from .models import Project
from .schemas import ProjectCreate


async def create_project(db: Session, project_in: ProjectCreate, user_id: str) -> Project:
    new_project = Project(
        name=project_in.name,
        deadline=project_in.deadline,
        subject_id=project_in.subject_id,
        description=project_in.description
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

async def get_project(db: Session, project_id: int) -> Project:
    return db.query(Project).filter(Project.id == project_id).first()

async def delete_project(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()

async def update_project(db: Session, project_id: int, project_update: ProjectCreate) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        project.name = project_update.name
        project.deadline = project_update.deadline
        project.description = project_update.description
        db.commit()
        db.refresh(project)
    return project


