import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app

@pytest.mark.asyncio
async def test_export_csv_success():
    """Test successful CSV generation and download headers"""
    mock_csv_content = "id,sentiment,content\n1,positive,great post\n2,negative,bad post"
    
    with patch("app.controllers.report_controller.report_service.generate_csv", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_csv_content

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/reports/export-csv")

        assert response.status_code == 200
        assert response.headers["content-type"] == "text/csv; charset=utf-8"
        assert "attachment" in response.headers["content-disposition"]
        assert "sentiment_report_" in response.headers["content-disposition"]
        assert response.text == mock_csv_content
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_export_pdf_success():
    """Test successful PDF generation and inline headers"""
    mock_pdf_content = b"%PDF-1.4 mock pdf data"

    with patch("app.controllers.report_controller.report_service.generate_pdf", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_pdf_content

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/reports/export-pdf")

        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"
        assert "inline" in response.headers["content-disposition"]
        assert response.content == mock_pdf_content
        mock_gen.assert_called_once()

@pytest.mark.asyncio
async def test_export_pdf_failure():
    """Test behavior when PDF generation returns None"""
    with patch("app.controllers.report_controller.report_service.generate_pdf", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = None

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/reports/export-pdf")

        assert response.status_code == 200
        assert response.json() == {"error": "Failed to generate PDF"}
        mock_gen.assert_called_once()