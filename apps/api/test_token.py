import os
import requests
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET = os.getenv("NEXTAUTH_SECRET", "xTRUfbAHqYpnODz3epGEaF68Mvj7qWN/Y1qckouWlYs=")
print(f"Using Secret: {SECRET}")

# Create token like frontend does
token = jwt.encode({"sub": "1"}, SECRET, algorithm="HS256")
print(f"Generated Token: {token}")

# Call backend
headers = {"Authorization": f"Bearer {token}"}
resp = requests.get("http://localhost:8000/api/study/dashboard/stats", headers=headers)
print(f"Status: {resp.status_code}")
print(f"Response: {resp.text}")
