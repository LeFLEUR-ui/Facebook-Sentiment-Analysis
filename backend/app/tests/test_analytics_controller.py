import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from datetime import datetime
from app.main import app

@pytest.mark.asyncio
async def test_get_dashboard_data_success():
    """Test successful retrieval of dashboard stats with query params"""
    mock_stats = {
        "total_comments": 150,
        "sentiment_distribution": {"positive": 50, "neutral": 70, "negative": 30},
        "trends": []
    }

    with patch("app.controllers.analytics_controller.service.get_dashboard_stats", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_stats

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(
                "/analytics/dashboard",
                params={"start_date": "2026-03-05", "end_date": "2026-04-04"}
            )

        assert response.status_code == 200
        assert response.json() == mock_stats
        mock_get.assert_called_once()

@pytest.mark.asyncio
async def test_get_dashboard_data_missing_params():
    """Test validation error when query parameters are missing"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/analytics/dashboard")
    
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_get_notifications_success():
    """Test successful retrieval of recent notifications"""
    mock_notifications = [
        {"id": 1, "title": "New negative comment", "time": "2 mins ago", "sentiment": "negative"},
        {"id": 2, "title": "New positive comment", "time": "5 mins ago", "sentiment": "positive"}
    ]

    with patch("app.controllers.analytics_controller.service.get_recent_notifications", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_notifications

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/analytics/notifications")

        assert response.status_code == 200
        assert len(response.json()) == 2
        assert response.json()[0]["title"] == "New negative comment"
        mock_get.assert_called_once()

@pytest.mark.asyncio
async def test_get_dashboard_data_invalid_date_format():
    """Test error handling for incorrect date strings"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(
            "/analytics/dashboard",
            params={"start_date": "invalid-date", "end_date": "2026-04-04"}
        )
    
    assert response.status_code == 500