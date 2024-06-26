"""update message

Revision ID: 5df13f3f88cc
Revises: ec4231ba1311
Create Date: 2024-04-05 17:11:51.091498

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5df13f3f88cc'
down_revision: Union[str, None] = 'ec4231ba1311'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('project', 'is_visible',
                    existing_type=sa.BOOLEAN(),
                    nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('project', 'is_visible',
                    existing_type=sa.BOOLEAN(),
                    nullable=True)
    # ### end Alembic commands ###
