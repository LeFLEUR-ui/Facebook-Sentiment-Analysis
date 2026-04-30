from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Response, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.report_service import ReportService
import io

router = APIRouter(prefix="/reports", tags=["Reports"])
report_service = ReportService()

@router.get("/export-csv")
async def export_csv(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    end = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59) if end_date else None
    
    csv_data = await report_service.generate_csv(db, start_date=start, end_date=end, search=search)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"sentiment_report_{timestamp}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.get("/export-pdf")
async def export_pdf(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    end = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59) if end_date else None
    
    pdf_data = await report_service.generate_pdf(db, start_date=start, end_date=end, search=search)
    
    if pdf_data is None:
        return {"error": "Failed to generate PDF"}

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline; filename=sentiment_report.pdf"}
    )