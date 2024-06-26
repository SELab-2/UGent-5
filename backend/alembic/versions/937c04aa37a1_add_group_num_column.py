"""add group num column

Revision ID: 937c04aa37a1
Revises: 566f33fb161f
Create Date: 2024-05-18 18:09:30.734349

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "937c04aa37a1"
down_revision: Union[str, None] = "566f33fb161f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "team", sa.Column("num", sa.Integer(), nullable=False, server_default="0")
    )
    op.drop_column("team", "team_name")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "team",
        sa.Column(
            "team_name",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=False,
            server_default="DEFAULT_GROUP_NAME",
        ),
    )
    op.drop_column("team", "num")
    # ### end Alembic commands ###
