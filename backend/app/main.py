from fastapi import FastAPI, Request
from app.config import cors_allow_origins
from app.request_util import public_base_url
from app.database import create_db_and_tables
from app.api import router as school_api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chalk API")

origins = cors_allow_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# create db and tables on startup
@app.on_event("startup")
def start_up():
    create_db_and_tables()

# Include the routes from api.py
app.include_router(school_api_router)

@app.get("/")
def root(request: Request):
    return {
        "message": "Welcome to Chalk API",
        "server_base_url": public_base_url(request) or None,
    }