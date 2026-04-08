# Facebook Sentiment Analysis Dashboard

An end-to-end Full-Stack application that scans Facebook comments and uses a **Deep Learning** backend to perform real-time sentiment analysis. Featuring a high-performance React dashboard with live-updating charts and a notification system.

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![Keras](https://img.shields.io/badge/Keras-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Key Features
* **Live Scanning:** Analyze Facebook post comments via a custom scanning tool.
* **AI Backend:** FastAPI server integrated with a trained TensorFlow/Keras model.
* **Dynamic Analytics:** Interactive Bar and Doughnut charts powered by Chart.js.
* **Date Filtering:** Historical sentiment trends with custom date range selection.
* **Real-time Notifications:** Instant feedback on community health and scan status.
* **Containerized:** Built with Docker for one-click deployment.

---

## Project Structure
```text
sentiment-analysis/
├── backend/                # FastAPI & AI Logic
│   ├── app/                # Application code
│   ├── Dockerfile          # Production container setup
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Dashboard
│   ├── src/                # Components & Hooks
│   └── package.json        # NPM dependencies
└── .env                    # Secret keys & DB URLs

## Installation & Setup

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up a virtual environment:

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Linux/macOS:
source venv/bin/activate  
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

```

### Environment Variables (.env)
Create a file named `.env` in the `backend/` root directory and add the following configuration:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/sentiment
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Run Locally
Start the development server with hot-reload enabled. This will automatically restart the server whenever you save changes to your code:

```bash
python -m uvicorn app.main:app --reload
```

### Frontend Setup (React)
Navigate to the frontend directory to install dependencies and launch the development server:

```bash
cd frontend
# Install all required npm packages
npm install
# Start the React development server
npm start
```

## Deployment (Render.com)

### Backend (Docker Runtime)
Since we are using Docker for the backend, Render will build the container automatically using our `Dockerfile`.

1. **Runtime:** Select **Docker** from the runtime dropdown.
2. **Instance Type:** Select at least the **Starter (2GB RAM)** instance. 
   > **Important:** TensorFlow requires significant memory to load models; using the Free Tier (512MB) will likely result in an `Out of Memory (OOM)` error.
3. **Environment Variables:** Navigate to the **Environment** tab in the Render Dashboard and manually add your `.env` keys:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `ALGORITHM`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`

---

### Frontend (Static Site)
Deploy the React dashboard as a high-performance static site.

1. **Build Command:** `npm run build`
2. **Publish Directory:** `build`
3. **Environment Variables:** If your API URL is different in production, add `REACT_APP_API_URL` to point to your Render Backend URL.

---

**Note:** Ensure your Backend is deployed first so you can provide the correct API URL to your Frontend during its build process.
