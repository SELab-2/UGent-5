"""added project fields

Revision ID: 3afcfe7efa6c
Revises: 2495a29910e6
Create Date: 2024-05-02 14:00:50.954847

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3afcfe7efa6c'
down_revision: Union[str, None] = '2495a29910e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
