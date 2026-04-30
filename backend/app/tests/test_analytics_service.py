import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timezone
from app.services.analytics_service import AnalyticsService
from app.models.models import SentimentRecord

@pytest.mark.anyio
async def test_get_dashboard_stats():
    service = AnalyticsService()
    db = AsyncMock()
    
    # Mocking the result of the query
    mock_row = MagicMock()
    mock_row.date = "2026-04-30"
    mock_row.total = 10
    mock_row.pos = 5
    mock_row.neg = 3
    mock_row.neu = 2
    
    mock_result = MagicMock()
    mock_result.all.return_value = [mock_row]
    db.execute.return_value = mock_result
    
    start_date = datetime(2026, 4, 1, tzinfo=timezone.utc)
    end_date = datetime(2026, 4, 30, tzinfo=timezone.utc)
    
    stats = await service.get_dashboard_stats(db, start_date, end_date)
    
    assert stats["labels"] == ["2026-04-30"]
    assert stats["sentiment"]["positive"] == 5
    assert stats["sentiment"]["negative"] == 3
    assert stats["sentiment"]["neutral"] == 2
    assert stats["timeline"]["positive"] == [5]
    assert stats["timeline"]["negative"] == [3]
    assert stats["timeline"]["neutral"] == [2]
    db.execute.assert_called_once()

@pytest.mark.anyio
async def test_get_recent_notifications():
    service = AnalyticsService()
    db = AsyncMock()
    
    record = SentimentRecord(
        id=1,
        username="user1",
        sentiment_label="positive",
        created_at=datetime.now(timezone.utc)
    )
    
    mock_result = MagicMock()
    # In analytics_service.py: records = result.scalars().all()
    mock_result.scalars.return_value.all.return_value = [record]
    db.execute.return_value = mock_result
    
    notifications = await service.get_recent_notifications(db)
    
    assert len(notifications) == 1
    assert notifications[0]["id"] == 1
    assert "positive" in notifications[0]["title"]
    assert "user1" in notifications[0]["title"]
    assert notifications[0]["sentiment"] == "positive"
    db.execute.assert_called_once()
