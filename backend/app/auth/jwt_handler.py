from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ------------------------
# PASSWORD HASHING HELPERS
# ------------------------
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)


# ------------------------
# JWT CREATION
# ------------------------
def create_access_token(data: dict, expires_delta: timedelta = None):
    """Generate JWT token"""
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# ------------------------
# JWT VERIFICATION  ⭐⭐⭐ FIX
# ------------------------
def verify_access_token(token: str):
    """Verify token and return payload OR None"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
