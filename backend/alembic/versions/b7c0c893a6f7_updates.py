"""updates

Revision ID: b7c0c893a6f7
Revises: a88aec136b59
Create Date: 2024-04-04 17:26:00.293041

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c0c893a6f7'
down_revision: Union[str, None] = 'a88aec136b59'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('is_visible', sa.Boolean(), nullable=True))
    op.alter_column('project', 'subject_id',
                    existing_type=sa.INTEGER(),
                    nullable=False)
    op.add_column('subject', sa.Column('academic_year', sa.Integer(), nullable=False))
    op.add_column('subject', sa.Column('uuid', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('subject', 'uuid')
    op.drop_column('subject', 'academic_year')
    op.alter_column('project', 'subject_id',
                    existing_type=sa.INTEGER(),
                    nullable=True)
    op.drop_column('project', 'is_visible')
    # ### end Alembic commands ###
