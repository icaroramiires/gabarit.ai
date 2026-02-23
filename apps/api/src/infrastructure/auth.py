from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
SECRET_KEY = os.getenv("NEXTAUTH_SECRET")
ALGORITHM = "HS256"

async def get_current_user(auth: HTTPAuthorizationCredentials = Security(security)) -> str:
    token = auth.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="User ID not found in token")
        return user_id
    except JWTError as e:
        print(f"JWT Validation Error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
