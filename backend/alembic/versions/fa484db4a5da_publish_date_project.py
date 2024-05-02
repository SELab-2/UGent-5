"""publish date project

Revision ID: fa484db4a5da
Revises: 1c4eb2b9d8da
Create Date: 2024-04-15 20:27:14.690831

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fa484db4a5da'
down_revision: Union[str, None] = '1c4eb2b9d8da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
