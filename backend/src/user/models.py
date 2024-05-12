from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base


class User(Base):
    __tablename__ = "website_user"

    uid: Mapped[str] = mapped_column(primary_key=True)
    given_name: Mapped[str]
    surname: Mapped[str]
    mail: Mapped[str]
    is_admin: Mapped[bool] = mapped_column(default=False)
    is_teacher: Mapped[bool] = mapped_column(default=False)
