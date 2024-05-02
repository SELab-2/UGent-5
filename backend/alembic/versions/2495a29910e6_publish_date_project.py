"""publish date project

Revision ID: 2495a29910e6
Revises: fa484db4a5da
Create Date: 2024-04-16 15:14:08.012608

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2495a29910e6'
down_revision: Union[str, None] = 'fa484db4a5da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
