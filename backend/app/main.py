from fastapi import FastAPI
from app.database import create_db_and_tables
from app.api import router as school_api_router

app = FastAPI(title="Chalk API")

# create db and tables on startup
@app.on_event("startup")
def start_up():
    create_db_and_tables()

# Include the routes from api.py
app.include_router(school_api_router)

@app.get("/")
def root():
    return {"message": "Welcome to Chalk API"}