from datetime import datetime, timezone
import os
import re
import numpy as np
from sqlalchemy import func, select
import tensorflow as tf
import emoji
from googletrans import Translator
from sqlalchemy.ext.asyncio import AsyncSession
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Embedding, LSTM, Dense

from app.models.models import Post, SentimentRecord


class SentimentModelService:
    def __init__(self):
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
        tf.get_logger().setLevel('ERROR')

        self.VOCAB_SIZE = 10000
        self.MAX_LEN = 100
        self.EMBED_DIM = 32
        self.MODEL_PATH = "sentiment_lstm.h5"

        self.translator = Translator()
        self.model = self._get_model()
        self.word_index = self._prepare_word_index()

    def _get_model(self):
        if os.path.exists(self.MODEL_PATH):
            return load_model(self.MODEL_PATH)
        
        (x_train, y_train), _ = imdb.load_data(num_words=self.VOCAB_SIZE)
        x_train = pad_sequences(x_train, maxlen=self.MAX_LEN)
        model = Sequential([
            Embedding(self.VOCAB_SIZE, self.EMBED_DIM, input_length=self.MAX_LEN),
            LSTM(64),
            Dense(1, activation='sigmoid')
        ])
        model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
        model.fit(x_train, y_train, epochs=2, batch_size=64, verbose=0)
        model.save(self.MODEL_PATH)
        return model

    def _prepare_word_index(self):
        raw_word_index = imdb.get_word_index()
        word_index = {k: (v + 3) for k, v in raw_word_index.items()}
        word_index.update({"<PAD>": 0, "<START>": 1, "<UNK>": 2})
        return word_index

    def extract_comments(self, text: str):
        """
        Extract (username, comment) pairs from raw Facebook-like text.
        Handles multiline comments, timestamps (1d, 2h, etc.), 'Reply', 'Edited', and empty lines.
        """
        TS_PAT = r"^\d+[hdmy]$"
        lines = [line.strip() for line in text.splitlines() if line.strip() and line.strip() != "·"]

        results = []
        i = 0
        while i < len(lines):
            line = lines[i]

            if re.match(TS_PAT, line) or line in ["Reply", "Edited"]:
                i += 1
                continue

            if i + 1 < len(lines) and not re.match(TS_PAT, lines[i + 1]) and lines[i + 1] not in ["Reply", "Edited"]:
                name = line
                comment_lines = []
                i += 1

                # hirap ineng yernn, troublesome
                while i < len(lines) and not re.match(TS_PAT, lines[i]) \
                    and lines[i] not in ["Reply", "Edited"] \
                    and not re.match(r"^[A-Z][a-z]+ [A-Z][a-z]+", lines[i]):
                    comment_lines.append(lines[i])
                    i += 1

                if comment_lines:
                    comment_text = " ".join(comment_lines).strip()
                    results.append((name, comment_text))
            else:
                i += 1

        print(f"DEBUG: Final extracted comments: {results}")
        return results

    def _encode_comment(self, text: str):
        clean_text = re.sub(r'[^\w\s]', ' ', text.lower())
        tokens = clean_text.split()
        encoded = [1]
        for word in tokens:
            idx = self.word_index.get(word, 2)
            encoded.append(idx if idx < self.VOCAB_SIZE else 2)
        return pad_sequences([encoded], maxlen=self.MAX_LEN)

    def analyze_sentiment(self, text: str):
        try:
            text = emoji.demojize(text, delimiters=(" ", " ")).replace("_", " ")
            translated = self.translator.translate(text, src='tl', dest='en').text
            
            encoded = self._encode_comment(translated)
            score = self.model.predict(encoded, verbose=0)[0][0]

            if score >= 0.58:
                return "positive", float(round(score, 4))
            elif score <= 0.42:
                return "negative", float(round(score, 4))
            return "neutral", float(round(score, 4))
        except Exception:
            return "analysis_error", 0.0

    def _extract_post_header(self, raw_text: str):
        """
        Extracts the first meaningful paragraph to use as the 'Post' content.
        """
        lines = [line.strip() for line in raw_text.splitlines() if line.strip() and line.strip() != "·"]
        if not lines:
            return "Empty Post Content"

        header_lines = []
        for line in lines[:3]:
            if len(line) > 5:
                header_lines.append(line)
        
        return " ".join(header_lines)[:500]

    async def analyze_bulk_and_save(self, db: AsyncSession, post_content: str, raw_text: str):
        """
        Main Business Logic: 
        1. Saves the parent Post.
        2. Processes the child comments (SentimentRecords).
        """

        extracted = self.extract_comments(raw_text)
        
        new_post = Post(
            content=post_content,
            reactions_count=np.random.randint(5, 150),
            comments_count=len(extracted),
            shares_count=np.random.randint(0, 20),
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_post)

        await db.flush()

        results = []
        stats = {"positive": 0, "negative": 0, "neutral": 0, "analysis_error": 0}

        if not extracted:
            await db.commit()
            return {"results": [], "summary": stats, "total": 0}

        for name, comment in extracted:
            try:
                sentiment, score = self.analyze_sentiment(comment)
                stats[sentiment] += 1
            except Exception:
                sentiment, score = "analysis_error", 0.0
                stats["analysis_error"] += 1

            db_record = SentimentRecord(
                username=name,
                comment_text=comment,
                sentiment_label=sentiment,
                confidence_score=score,
                created_at=datetime.now(timezone.utc)
            )
            db.add(db_record)

            results.append({
                "name": name,
                "comment": comment,
                "sentiment": sentiment,
                "score": score
            })

        try:
            await db.commit()
            print(f"SUCCESS: Saved Post and {len(results)} comments.")
        except Exception as e:
            await db.rollback()
            print(f"DATABASE ERROR: {e}")
            raise e

        return {
            "results": results,
            "summary": stats,
            "total": len(results)
        }
    
    async def get_comment_stats(self, db: AsyncSession):
        try:
            total_stmt = select(func.count(SentimentRecord.id))
            total_result = await db.execute(total_stmt)
            total = total_result.scalar() or 0

            sentiment_stmt = select(
                SentimentRecord.sentiment_label,
                func.count(SentimentRecord.id)
            ).group_by(SentimentRecord.sentiment_label)
            
            sentiment_result = await db.execute(sentiment_stmt)

            stats = {
                "total": total,
                "positive": 0,
                "negative": 0,
                "neutral": 0,
                "analysis_error": 0,
            }

            for label, count in sentiment_result.all():
                if label in stats:
                    stats[label] = count

            return stats

        except Exception as e:
            print(f"ERROR fetching stats: {e}")
            return {
                "total": 0,
                "positive": 0,
                "negative": 0,
                "neutral": 0,
                "analysis_error": 0,
            }
        
    async def get_daily_trends(self, db: AsyncSession):
        try:
            stmt = (
                select(
                    func.date(SentimentRecord.created_at).label("date"),
                    SentimentRecord.sentiment_label,
                    func.count(SentimentRecord.id).label("count")
                )
                .group_by("date", SentimentRecord.sentiment_label)
                .order_by("date")
            )
            
            result = await db.execute(stmt)
            rows = result.all()

            trends = {}
            for date_obj, label, count in rows:
                date_str = str(date_obj)
                if date_str not in trends:
                    trends[date_str] = {"positive": 0, "neutral": 0, "negative": 0}
                
                if label in trends[date_str]:
                    trends[date_str][label] = count

            return trends
        except Exception as e:
            print(f"ERROR fetching trends: {e}")
            return {}