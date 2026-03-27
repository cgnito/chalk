import base64
import logging
import os

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Defaults match QA inline checkout test credentials (must match frontend webpayCheckout).
MERCHANT_CODE = os.getenv("ISW_MERCHANT_CODE") or "MX6072"
PAY_ITEM_ID = os.getenv("ISW_PAY_ITEM_ID") or "9405967"
CLIENT_ID = os.getenv("ISW_CLIENT_ID")
SECRET = os.getenv("ISW_SECRET")
INTERSWITCH_API_BASE = os.getenv("ISW_API_BASE", "https://qa.interswitchng.com").rstrip("/")

async def verify_interswitch_payment(reference: str, amount_naira: float) -> bool:
    amount_kobo = int(round(amount_naira * 100))

    verify_url = (
        f"{INTERSWITCH_API_BASE}/collections/api/v1/gettransaction.json?"
        f"merchantcode={MERCHANT_CODE}&"
        f"transactionreference={reference}&"
        f"amount={amount_kobo}"
    )

    headers = {}
    if CLIENT_ID and SECRET:
        token = base64.b64encode(f"{CLIENT_ID}:{SECRET}".encode()).decode()
        headers["Authorization"] = f"Basic {token}"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(verify_url, headers=headers)
            if response.status_code != 200:
                return False

            data = response.json()
            code = data.get("ResponseCode") or data.get("responseCode")
            return code == "00"
    except Exception as e:
        logger.warning("Interswitch verification failed: %s", e)
        return False