# FastAPI Backend Documentation

This document outlines the API structure, authentication, and core services for the Facebook Sentiment Analysis system.

---

## Base URL
- **Local:** `http://localhost:8000`
- **Interactive Docs (Swagger UI):** `http://localhost:8000/docs`
- **Alternative Docs (ReDoc):** `http://localhost:8000/redoc`

---

## API Endpoints

### 1. Analytics Controller (`/analytics`)
Handles high-level data aggregation for the dashboard charts.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/analytics/dashboard` | Returns total counts and sentiment distribution between two dates. |
| `GET` | `/analytics/notifications` | Fetches the most recent sentiment alerts for the live feed. |

### 2. Post Management (`/posts`)
Handles the retrieval of scanned Facebook posts.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/posts/` | Returns a list of all posts stored in the database. |

### 3. Machine Learning Service (`/ml`)
The core AI engine that processes text via the TensorFlow/Keras model.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/ml/analyze` | Receives raw comment text, runs AI inference, and saves results. |
| `GET` | `/ml/stats` | Returns the global breakdown of Positive/Neutral/Negative totals. |
| `GET` | `/ml/trends` | Returns daily sentiment counts for the Growth Analysis bar chart. |

### 4. Reporting Service (`/reports`)
Generates downloadable summaries of analyzed data.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/export-csv` | Generates and downloads a `.csv` file of all sentiment results. |
| `GET` | `/reports/export-pdf` | Generates a binary PDF stream for browser-viewing or download. |

---

## Core Architecture

### **Database (PostgreSQL)**
We use **SQLAlchemy (Async)** for non-blocking database operations. 
- **Models:** `Post`, `Comment`, `Notification`.
- **Migrations:** Managed via the `database.py` initialization.

### **Sentiment Model Service**
- **Model Type:** Deep Learning (CNN/LSTM) built with **TensorFlow**.
- **Preprocessing:** Tokenization and Padding are handled before inference.
- **Batch Processing:** The `/ml/analyze` endpoint handles bulk text to optimize GPU/CPU usage.

---

## Authentication & Security
The backend utilizes **JWT (JSON Web Tokens)** for secure communication.
- **Algorithm:** `HS256`
- **Secret Key:** Managed via the `.env` file.
- **Expiration:** Default is set to 60 minutes.

---

## Testing
The backend is verified using **Pytest** and **HTTPX**. 
To run the automated test suite:
```bash
cd backend
pytest