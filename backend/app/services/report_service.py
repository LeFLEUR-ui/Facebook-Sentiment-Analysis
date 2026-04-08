import io
import pandas as pd
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from xhtml2pdf import pisa
from app.models.models import SentimentRecord

class ReportService:
    async def get_report_data(self, db: AsyncSession):
        """Helper to fetch all records for reports"""
        stmt = select(SentimentRecord).order_by(SentimentRecord.created_at.desc())
        result = await db.execute(stmt)
        return result.scalars().all()

    async def generate_csv(self, db: AsyncSession):
        records = await self.get_report_data(db)
        
        data = [
            {
                "ID": r.id,
                "Username": r.username,
                "Comment": r.comment_text,
                "Sentiment": r.sentiment_label,
                "Score": r.confidence_score,
                "Date": r.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for r in records
        ]
        
        df = pd.DataFrame(data)
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        return stream.getvalue()

    async def generate_pdf(self, db: AsyncSession):
        records = await self.get_report_data(db)
        
        total = len(records)
        pos = sum(1 for r in records if r.sentiment_label == "positive")
        neg = sum(1 for r in records if r.sentiment_label == "negative")
        neu = sum(1 for r in records if r.sentiment_label == "neutral")

        html_content = f"""
        <html>
        <head>
            <style>
                @page {{ size: A4; margin: 1cm; }}
                body {{ font-family: Helvetica, Arial, sans-serif; color: #333; }}
                .header {{ text-align: center; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }}
                .summary {{ margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 10px; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                th {{ background-color: #4f46e5; color: white; padding: 8px; text-align: left; font-size: 10pt; }}
                td {{ border-bottom: 1px solid #ddd; padding: 8px; font-size: 9pt; }}
                .pos {{ color: #10b981; font-weight: bold; }}
                .neg {{ color: #f43f5e; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Sentiment Analysis Report</h1>
                <p>Generated on: {datetime.now().strftime("%B %d, %Y")}</p>
            </div>

            <div class="summary">
                <h3>Executive Summary</h3>
                <p>Total Comments Analyzed: <strong>{total}</strong></p>
                <p>Positive: {pos} | Neutral: {neu} | Negative: {neg}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Comment</th>
                        <th>Sentiment</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {"".join([f'<tr><td>{r.username}</td><td>{r.comment_text[:50]}...</td><td>{r.sentiment_label}</td><td>{r.confidence_score}</td></tr>' for r in records])}
                </tbody>
            </table>
        </body>
        </html>
        """
        
        pdf_buffer = io.BytesIO()
        pisa_status = pisa.CreatePDF(io.StringIO(html_content), dest=pdf_buffer)
        
        if pisa_status.err:
            return None
            
        return pdf_buffer.getvalue()