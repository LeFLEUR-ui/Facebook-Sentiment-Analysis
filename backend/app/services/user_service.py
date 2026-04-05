from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.models import User
from app.auth import hash_password, verify_password


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalars().first()


async def create_user(db: AsyncSession, email: str, password: str):
    hashed_password = hash_password(password)

    new_user = User(
        email=email,
        password=hashed_password
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


async def authenticate_user(db: AsyncSession, email: str, password: str):
    user = await get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user