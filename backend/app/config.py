"""Deployment settings from environment."""

import os


def cors_allow_origins() -> list[str]:
    """Comma-separated CORS_ORIGINS, else BASE_URL, else local dev defaults."""
    raw = os.getenv("CORS_ORIGINS", "").strip()
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    base = os.getenv("BASE_URL", "").strip().rstrip("/")
    if base:
        return [base]
    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
    ]
