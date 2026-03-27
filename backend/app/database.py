import os

from sqlmodel import SQLModel, create_engine

_DEFAULT_SQLITE = "sqlite:///./app/chalk.db"
DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_SQLITE).strip()
_engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "").lower() in ("1", "true", "yes"),
    **_engine_kwargs,
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)