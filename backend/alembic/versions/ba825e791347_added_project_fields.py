"""added project fields

Revision ID: ba825e791347
Revises: dc4232adcc1b
Create Date: 2024-05-02 17:06:29.370435

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ba825e791347'
down_revision: Union[str, None] = 'dc4232adcc1b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
