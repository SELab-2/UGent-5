"""enroll_deadline_added

Revision ID: 29a17fa183de
Revises: fc317e930257
Create Date: 2024-03-11 19:09:35.872572

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '29a17fa183de'
down_revision: Union[str, None] = 'fc317e930257'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('enroll_deadline', sa.Date(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('project', 'enroll_deadline')
    # ### end Alembic commands ###
