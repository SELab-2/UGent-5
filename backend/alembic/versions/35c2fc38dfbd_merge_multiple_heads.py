"""Merge multiple heads

Revision ID: 35c2fc38dfbd
Revises: b634aaf17a21, ecbdc859aca6
Create Date: 2024-03-13 16:02:57.723162

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35c2fc38dfbd'
down_revision: Union[str, None] = ('b634aaf17a21', 'ecbdc859aca6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
