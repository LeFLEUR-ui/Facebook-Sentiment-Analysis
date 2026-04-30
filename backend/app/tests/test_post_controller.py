import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app

@pytest.mark.anyio
async def test_get_all_posts_success():
    """Test successful retrieval of all posts"""
    mock_posts = [
        {
            "id": 1, 
            "fb_post_id": "12345", 
            "content": "Sample post content", 
            "created_at": "2026-04-01T10:00:00"
        },
        {
            "id": 2, 
            "fb_post_id": "67890", 
            "content": "Another post", 
            "created_at": "2026-04-02T12:00:00"
        }
    ]

    with patch("app.controllers.post_controller.post_service.get_all_posts", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_posts

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/posts/")

        assert response.status_code == 200
        assert len(response.json()) == 2
        assert response.json()[0]["fb_post_id"] == "12345"
        mock_get.assert_called_once()

@pytest.mark.anyio
async def test_get_posts_empty_list():
    """Test response when no posts exist in the database"""
    with patch("app.controllers.post_controller.post_service.get_all_posts", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = []

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/posts/")

        assert response.status_code == 200
        assert response.json() == []
        mock_get.assert_called_once()