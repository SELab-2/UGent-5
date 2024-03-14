"""init

Revision ID: 433f14a588c0
Revises: 
Create Date: 2024-03-14 13:27:44.612732

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '433f14a588c0'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subject',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('website_user',
                    sa.Column('uid', sa.String(), nullable=False),
                    sa.Column('given_name', sa.String(), nullable=False),
                    sa.Column('mail', sa.String(), nullable=False),
                    sa.Column('is_admin', sa.Boolean(), nullable=False),
                    sa.PrimaryKeyConstraint('uid')
                    )
    op.create_table('project',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('deadline', sa.DateTime(
                        timezone=True), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('subject_id', sa.Integer(), nullable=True),
                    sa.Column('description', sa.String(), nullable=True),
                    sa.Column('enroll_deadline', sa.DateTime(
                        timezone=True), nullable=True),
                    sa.CheckConstraint('deadline >= CURRENT_DATE',
                                       name='deadline_check'),
                    sa.ForeignKeyConstraint(
                        ['subject_id'], ['subject.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('student_subject',
                    sa.Column('uid', sa.String(), nullable=True),
                    sa.Column('subject_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
                    sa.ForeignKeyConstraint(['uid'], ['website_user.uid'], )
                    )
    op.create_table('teacher_subject',
                    sa.Column('uid', sa.String(), nullable=True),
                    sa.Column('subject_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
                    sa.ForeignKeyConstraint(['uid'], ['website_user.uid'], )
                    )
    op.create_table('team',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('team_name', sa.String(), nullable=False),
                    sa.Column('score', sa.Integer(), nullable=False),
                    sa.Column('project_id', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['project_id'], ['project.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('student_group',
                    sa.Column('uid', sa.String(), nullable=True),
                    sa.Column('team_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['team_id'], ['team.id'], ),
                    sa.ForeignKeyConstraint(['uid'], ['website_user.uid'], )
                    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('student_group')
    op.drop_table('team')
    op.drop_table('teacher_subject')
    op.drop_table('student_subject')
    op.drop_table('project')
    op.drop_table('website_user')
    op.drop_table('subject')
    # ### end Alembic commands ###
