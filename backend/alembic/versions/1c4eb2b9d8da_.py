"""empty message

Revision ID: 1c4eb2b9d8da
Revises: 20886268d8b4, aa8ad1b4f8dc
Create Date: 2024-04-15 20:24:46.151762

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1c4eb2b9d8da'
down_revision: Union[str, None] = ('20886268d8b4', 'aa8ad1b4f8dc')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
