"""Merge multiple heads

Revision ID: 68501475d3a9
Revises: 3afcfe7efa6c, d0e0719b1939
Create Date: 2024-05-02 14:01:13.292106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '68501475d3a9'
down_revision: Union[str, None] = ('3afcfe7efa6c', 'd0e0719b1939')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
