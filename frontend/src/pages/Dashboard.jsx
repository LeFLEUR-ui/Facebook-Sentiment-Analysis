import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import Header from '../components/dashboard/Overview/Header.jsx';
import Stats from '../components/dashboard/Overview/Stats.jsx';
import Tabs from '../components/dashboard/Overview/Tabs.jsx';
import AnalyticsCharts from '../components/dashboard/Overview/AnalyticsCharts.jsx';
import Engagement from '../components/dashboard/Overview/Engagement.jsx';
import PostsMetrics from '../components/dashboard/PostMetrics.jsx';
import Reports from '../components/dashboard/Reports.jsx';
import Insights from '../components/dashboard/Insights.jsx';
import Scan from '../components/dashboard/Scan.jsx';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [startDate, setStartDate] = useState('2026-03-05');
  const [endDate, setEndDate] = useState('2026-04-08');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) navigate('/login');
  }, [navigate]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
  `http://localhost:8000/analytics/dashboard?start_date=${startDate}&end_date=${endDate}`
);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const cumulative = (arr) => arr.map(((sum) => (value) => (sum += value))(0));

  const commonOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: { duration: 500, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] } } }
  };

  const sentimentData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{ 
      data: analytics ? [analytics.sentiment.positive, analytics.sentiment.negative, analytics.sentiment.neutral] : [0,0,0], 
      backgroundColor: ['#10b981', '#ef4444', '#94a3b8'] 
    }]
  };

  const timelineData = {
    labels: analytics?.labels || [],
    datasets: [
      { label: 'Positive', data: analytics?.timeline.positive || [], borderColor: '#10b981', tension: 0.4, pointRadius: 2 },
      { label: 'Negative', data: analytics?.timeline.negative || [], borderColor: '#ef4444', tension: 0.4, pointRadius: 2 },
      { label: 'Neutral', data: analytics?.timeline.neutral || [], borderColor: '#6366f1', tension: 0.4, pointRadius: 2 }
    ]
  };

  const cumulativeData = {
    labels: analytics?.labels || [],
    datasets: [
      { fill: true, label: 'Positive Trend', data: cumulative(analytics?.timeline.positive || []), backgroundColor: 'rgba(16,185,129,0.1)', borderColor: '#10b981', tension: 0.4 },
      { fill: true, label: 'Negative Trend', data: cumulative(analytics?.timeline.negative || []), backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444', tension: 0.4 }
    ]
  };

  const reactionBarData = {
    labels: ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'],
    datasets: [{ label: 'Reactions', data: [10222, 5094, 2019, 1612, 793, 732], backgroundColor: '#6366f1' }]
  };
  const reactionPieData = {
    labels: ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'],
    datasets: [{ data: [50, 25, 10, 8, 4, 4], backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'] }]
  };

  const renderTabContent = () => {
    if (loading && activeTab === 'Overview') return <div className="py-20 text-center text-gray-400">Updating Analytics...</div>;

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8 transition-all duration-500 animate-fadeIn">
            <Stats />
            <AnalyticsCharts reactionBarData={reactionBarData} reactionPieData={reactionPieData} sentimentData={sentimentData} commonOptions={commonOptions} />
            <Engagement timelineData={timelineData} cumulativeData={cumulativeData} commonOptions={commonOptions} />
          </div>
        );
      case 'Sentiment':
        return <AnalyticsCharts reactionBarData={reactionBarData} reactionPieData={reactionPieData} sentimentData={sentimentData} commonOptions={commonOptions} />;
      case 'Trends':
        return <Engagement timelineData={timelineData} cumulativeData={cumulativeData} commonOptions={commonOptions} />;
      case 'Posts & Metrics': return <PostsMetrics />;
      case 'Insights': return <Insights />;
      case 'Reports': return <Reports />;
      case 'Scan': return <Scan />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-800">Date Range Filter</h1>
          <p className="text-sm mb-6 text-gray-500">Select date range to retrieve and analyze posts from the database</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-gray-800 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-gray-800 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="space-y-8">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
