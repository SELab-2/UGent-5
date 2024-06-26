"""add_docker_tests

Revision ID: d0e0719b1939
Revises: aa8ad1b4f8dc
Create Date: 2024-04-17 23:15:27.584358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd0e0719b1939'
down_revision: Union[str, None] = 'd9bbb7202d1f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('testresult',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('submission_id', sa.Integer(), nullable=False),
                    sa.Column('succeeded', sa.Boolean(), nullable=False),
                    sa.Column('value', sa.String(), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['submission_id'], ['submission.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.add_column('project', sa.Column('test_files_uuid', sa.String(), nullable=True))
    op.add_column('submission', sa.Column('remarks', sa.String(), nullable=True))
    op.add_column('submission', sa.Column('stdout', sa.String(), nullable=True))
    op.add_column('submission', sa.Column('stderr', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('submission', 'stderr')
    op.drop_column('submission', 'stdout')
    op.drop_column('submission', 'remarks')
    op.drop_column('project', 'test_files_uuid')
    op.drop_table('testresult')
    # ### end Alembic commands ###
