from sqlalchemy.orm import Session

from ..project import models as projectModels
from ..subject import models as subjectModels
from ..user import models as userModels
from . import schemas
from .models import Group, StudentGroup


async def get_group_by_id(db: Session, project_id, group_id: int) -> Group:
    return (db.query(Group)
            .filter(Group.project_id == project_id)
            .filter(Group.id == group_id).first())


async def get_groups_by_project(db: Session, project_id: int) -> list[Group]:#, list[userModels.User]]:
    groups = (
        db.query(Group)
        .filter(Group.project_id == project_id)
        .all()
    )
    # group_members = (
    #     db.query(userModels.User)
    #     .join(StudentGroup, userModels.User.uid == StudentGroup.columns.uid)
    #     .join(Group, StudentGroup.columns.team_id == Group.id)
    #     .filter(
    #         Group.project_id == project_id
    #     )
    #     .all()
    #)
    return groups#, group_members


async def get_groups_by_user(db: Session, user_id: str) -> list[Group]:
    return (
        db.query(Group).join(StudentGroup).filter(StudentGroup.c.uid == user_id).all()
    )


async def get_teachers_by_group(db: Session, group_id: int) -> list[userModels.User]:
    return (
        db.query(userModels.User)
        .join(subjectModels.TeacherSubject)
        .join(subjectModels.Subject)
        .join(projectModels.Project)
        .join(Group)
        .filter(Group.id == group_id)
        .filter(Group.project_id == projectModels.Project.id)
        .filter(projectModels.Project.subject_id == subjectModels.Subject.id)
        .all()
    )


async def create_group(db: Session, group: schemas.GroupCreate) -> Group:
    db_group = Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


async def join_group(db: Session, team_id: int, user_id: str):
    insert_stmnt = StudentGroup.insert().values(team_id=team_id, uid=user_id)
    db.execute(insert_stmnt)
    db.commit()


async def leave_group(db: Session, team_id: int, user_id: str):
    db.query(StudentGroup).filter_by(team_id=team_id, uid=user_id).delete()
    db.commit()
