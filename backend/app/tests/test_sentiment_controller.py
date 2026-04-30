import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app

@pytest.mark.anyio
async def test_analyze_comments_success():
    """Test the bulk analysis POST endpoint with a JSON payload"""
    request_payload = {
        "post_content": "This is a Facebook post",
        "raw_text": "I love this! \n This is terrible. \n It's okay."
    }
    
    mock_response = {
        "total": 3,
        "summary": {"positive": 1, "negative": 1, "neutral": 1},
        "results": [
            {"name": "User 1", "comment": "I love this!", "sentiment": "positive", "score": 0.9},
            {"name": "User 2", "comment": "This is terrible.", "sentiment": "negative", "score": 0.1},
            {"name": "User 3", "comment": "It's okay.", "sentiment": "neutral", "score": 0.5}
        ]
    }

    with patch("app.controllers.sentiment_model_controller.sentiment_service.analyze_bulk_and_save", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = mock_response

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/ml/analyze", json=request_payload)

        assert response.status_code == 200
        assert response.json()["total"] == 3
        assert response.json()["results"][0]["sentiment"] == "positive"
        mock_analyze.assert_called_once()

@pytest.mark.anyio
async def test_get_comment_stats_success():
    """Test retrieval of global sentiment statistics"""
    mock_stats = {
        "total": 100,
        "positive": 60,
        "negative": 20,
        "neutral": 20
    }

    with patch("app.controllers.sentiment_model_controller.sentiment_service.get_comment_stats", new_callable=AsyncMock) as mock_stats_call:
        mock_stats_call.return_value = mock_stats

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/ml/stats")

        assert response.status_code == 200
        assert response.json()["positive"] == 60
        mock_stats_call.assert_called_once()

@pytest.mark.anyio
async def test_get_trends_success():
    """Test retrieval of daily breakdown for trend charts"""
    mock_trends = [
        {"date": "2026-04-01", "positive": 10, "negative": 2, "neutral": 5},
        {"date": "2026-04-02", "positive": 15, "negative": 1, "neutral": 3}
    ]

    with patch("app.controllers.sentiment_model_controller.sentiment_service.get_daily_trends", new_callable=AsyncMock) as mock_trends_call:
        mock_trends_call.return_value = mock_trends

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/ml/trends")

        assert response.status_code == 200
        assert len(response.json()) == 2
        assert response.json()[0]["date"] == "2026-04-01"
        mock_trends_call.assert_called_once()

@pytest.mark.anyio
async def test_analyze_comments_invalid_payload():
    """Test validation error for missing required fields in POST body"""
    invalid_payload = {"post_content": "Missing raw_text"}
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/ml/analyze", json=invalid_payload)
    
    assert response.status_code == 422