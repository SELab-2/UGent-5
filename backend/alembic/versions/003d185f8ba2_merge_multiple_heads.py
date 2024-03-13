"""Merge multiple heads

Revision ID: 003d185f8ba2
Revises: 35c2fc38dfbd
Create Date: 2024-03-13 16:03:38.890771

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003d185f8ba2'
down_revision: Union[str, None] = '35c2fc38dfbd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
