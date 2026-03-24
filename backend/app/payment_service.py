import httpx
import os
from dotenv import load_dotenv

load_dotenv()

MERCHANT_CODE = os.environ["INTERSWITCH_MERCHANT_CODE"]
PAYABLE_CODE = os.environ["INTERSWITCH_PAYABLE_CODE"]
BASE_URL = os.environ["INTERSWITCH_BASE_URL"]

async def get_payment_url(amount_naira: float, reference: str, customer_email: str):
    #kobo to naira
    amount_kobo = str(int(amount_naira * 100))
    

    payload = {
        "merchantCode": MERCHANT_CODE,
        "payableCode": PAYABLE_CODE,
        "amount": amount_kobo,
        "redirectUrl": "http://localhost:3000/payment-success", #where parent returns
        "customerId": customer_email,
        "currencyCode": "566",
        "customerEmail": customer_email,
        "transactionReference": reference 
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/collections/api/v1/pay-bill", 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            
            return data.get("paymentUrl")
        else:
            print(f"Error: {response.text}")
            return None
        


#verify payments
async def verify_interswitch_payment(reference: str, amount_naira: float):
    amount_kobo = int(amount_naira * 100)
    
    verify_url = (
        f"{BASE_URL}/collections/api/v1/gettransaction.json?"
        f"merchantcode={MERCHANT_CODE}&"
        f"transactionreference={reference}&"
        f"amount={amount_kobo}"
    )
    
    async with httpx.AsyncClient() as client:
        response = await client.get(verify_url)
        if response.status_code == 200:
            data = response.json()
            # "00" success code, from inteerswitch
            if data.get("ResponseCode") == "00":
                return True
        return True #False #for MOCK for testing