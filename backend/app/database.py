from sqlmodel import SQLModel, create_engine

sqlite_file_name = "chalk.db"
sqlite_url = f"sqlite:///app/{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)