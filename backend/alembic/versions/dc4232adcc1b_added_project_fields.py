"""added project fields

Revision ID: dc4232adcc1b
Revises: 68501475d3a9
Create Date: 2024-05-02 14:01:20.317535

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc4232adcc1b'
down_revision: Union[str, None] = '68501475d3a9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
