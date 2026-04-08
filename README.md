# 📊 Facebook Sentiment Analysis Dashboard

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
