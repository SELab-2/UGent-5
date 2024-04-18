"""empty message

Revision ID: d9bbb7202d1f
Revises: 20886268d8b4, aa8ad1b4f8dc
Create Date: 2024-04-18 09:55:23.695033

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9bbb7202d1f'
down_revision: Union[str, None] = ('20886268d8b4', 'aa8ad1b4f8dc')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
