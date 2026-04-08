from datetime import datetime

from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.report_service import ReportService
import io

router = APIRouter(prefix="/reports", tags=["Reports"])
report_service = ReportService()

@router.get("/export-csv")
async def export_csv(db: AsyncSession = Depends(get_db)):
    csv_data = await report_service.generate_csv(db)
    
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
async def export_pdf(db: AsyncSession = Depends(get_db)):
    pdf_data = await report_service.generate_pdf(db)
    
    if pdf_data is None:
        return {"error": "Failed to generate PDF"}

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline; filename=sentiment_report.pdf"}
    )