import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from unittest.mock import AsyncMock, patch

from app.main import app
from app.schemas.schemas import UserResponse

@pytest.mark.anyio
class TestAuthController:

    @patch("app.controllers.user_controller.get_user_by_email", new_callable=AsyncMock)
    @patch("app.controllers.user_controller.create_user", new_callable=AsyncMock)
    async def test_register_success(self, mock_create_user, mock_get_user_by_email):
        mock_get_user_by_email.return_value = None
        mock_create_user.return_value = UserResponse(id=1, email="test@example.com")

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/auth/register", json={"email": "test@example.com", "password": "password123"})

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "id" in data

    @patch("app.controllers.user_controller.get_user_by_email", new_callable=AsyncMock)
    async def test_register_existing_email(self, mock_get_user_by_email):
        mock_get_user_by_email.return_value = UserResponse(id=1, email="test@example.com")

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/auth/register", json={"email": "test@example.com", "password": "password123"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["detail"] == "Email already registered"

    @patch("app.controllers.user_controller.authenticate_user", new_callable=AsyncMock)
    @patch("app.controllers.user_controller.create_access_token")
    async def test_login_success(self, mock_create_access_token, mock_authenticate_user):
        mock_authenticate_user.return_value = UserResponse(id=1, email="test@example.com")
        mock_create_access_token.return_value = "fake-jwt-token"

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/auth/login", json={"email": "test@example.com", "password": "password123"})

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["access_token"] == "fake-jwt-token"
        assert data["token_type"] == "bearer"

    @patch("app.controllers.user_controller.authenticate_user", new_callable=AsyncMock)
    async def test_login_invalid_credentials(self, mock_authenticate_user):
        mock_authenticate_user.return_value = None

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/auth/login", json={"email": "wrong@example.com", "password": "wrongpass"})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json()["detail"] == "Invalid credentials"