from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession  # ✅ CORRECT

from app.auth import create_access_token
from app.database import AsyncSessionLocal, get_db
from app.schemas.schemas import UserCreate, UserLogin, UserResponse
from app.services.user_service import authenticate_user, create_user, get_user_by_email


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = await create_user(db, user.email, user.password)
    return new_user


@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": db_user.email,
        "user_id": db_user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }