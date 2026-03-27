"""Per-request URL helpers (when BASE_URL is not set)."""

import os

from fastapi import Request


def public_base_url(request: Request) -> str:
    """Prefer BASE_URL; otherwise reconstruct from proxy headers or request URL."""
    env = os.getenv("BASE_URL", "").strip().rstrip("/")
    if env:
        return env

    host = (request.headers.get("host") or "").strip()
    if not host:
        return ""

    forwarded = (request.headers.get("x-forwarded-proto") or "").split(",")[0].strip()
    scheme = forwarded or request.url.scheme or "http"
    return f"{scheme}://{host}".rstrip("/")
