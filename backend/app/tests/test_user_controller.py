import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app import schemas

client = TestClient(app)


test_user = {"email": "marvinfabricante@gmail.com", "password": "sophia-nicole"}


@patch("app.services.user_service.register_user")
def test_register_success(mock_register):
    mock_register.return_value = {"access_token": "fake_token", "token_type": "bearer"}

    response = client.post("/users/register", json=test_user)

    assert response.status_code == 200
    assert response.json() == {"access_token": "fake_token", "token_type": "bearer"}
    mock_register.assert_called_once()


@patch("app.services.user_service.register_user")
def test_register_duplicate_email(mock_register):
    from fastapi import HTTPException
    mock_register.side_effect = HTTPException(status_code=400, detail="Email already registered")

    response = client.post("/users/register", json=test_user)

    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}


@patch("app.services.user_service.authenticate_user")
def test_login_success(mock_authenticate):
    mock_authenticate.return_value = {"access_token": "fake_token", "token_type": "bearer"}

    response = client.post(
        "/users/login",
        data={"username": test_user["email"], "password": test_user["password"]},
        headers={"content-type": "application/x-www-form-urlencoded"}
    )

    assert response.status_code == 200
    assert response.json() == {"access_token": "fake_token", "token_type": "bearer"}
    mock_authenticate.assert_called_once()


@patch("app.services.user_service.authenticate_user")
def test_login_invalid_credentials(mock_authenticate):
    from fastapi import HTTPException
    mock_authenticate.side_effect = HTTPException(status_code=401, detail="Invalid credentials")

    response = client.post(
        "/users/login",
        data={"username": test_user["email"], "password": "wrongpass"},
        headers={"content-type": "application/x-www-form-urlencoded"}
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}


@patch("app.services.user_service.get_current_user")
def test_me_success(mock_get_user):
    mock_get_user.return_value = {"email": test_user["email"]}

    response = client.get("/users/me", headers={"Authorization": "Bearer fake_token"})
    assert response.status_code == 200
    assert response.json() == {"email": test_user["email"]}
    mock_get_user.assert_called_once_with("fake_token")