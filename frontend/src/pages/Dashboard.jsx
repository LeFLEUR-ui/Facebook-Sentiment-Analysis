import React, { useState, useEffect } from 'react';
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
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Mar 05, 2026 - Apr 04, 2026');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const labels = Array.from({ length: 31 }, (_, i) => `Mar ${5 + i < 10 ? '0' + (5 + i) : 5 + i}`);

  const reactions = [400,50,350,750,450,1150,550,650,780,430,1050,200,1220,1210,470,1180,150,350,600,360,900,420,380,1040,1020,540,1050,1080,1450,200,80];
  const comments = [50,30,200,150,40,120,140,110,180,120,200,60,190,180,70,300,120,80,50,90,150,60,180,170,160,90,140,180,200,140,90];
  const shares = [20,10,60,70,30,120,60,40,90,50,110,30,100,90,50,120,60,30,100,70,120,50,80,60,50,40,100,80,120,50,30];

  const cumulative = (arr) => arr.map(((sum) => (value) => (sum += value))(0));

  const commonOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: { duration: 500, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] } } }
  };

  const reactionBarData = {
    labels: ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'],
    datasets: [{ label: 'Reactions', data: [10222, 5094, 2019, 1612, 793, 732], backgroundColor: '#6366f1' }]
  };

  const reactionPieData = {
    labels: ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'],
    datasets: [{
      data: [50, 25, 10, 8, 4, 4],
      backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']
    }]
  };

  const sentimentData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{ data: [60, 15, 25], backgroundColor: ['#10b981', '#ef4444', '#94a3b8'] }]
  };

  const timelineData = {
    labels,
    datasets: [
      { data: reactions, borderColor: '#6366f1', tension: 0.4, pointRadius: 2 },
      { data: comments, borderColor: '#10b981', tension: 0.4, pointRadius: 2 },
      { data: shares, borderColor: '#f59e0b', tension: 0.4, pointRadius: 2 }
    ]
  };

  const cumulativeData = {
    labels,
    datasets: [
      { fill: true, label: 'Reactions', data: cumulative(reactions), backgroundColor: 'rgba(99,102,241,0.2)', borderColor: '#6366f1', tension: 0.4 },
      { fill: true, label: 'Comments', data: cumulative(comments), backgroundColor: 'rgba(16,185,129,0.2)', borderColor: '#10b981', tension: 0.4 },
      { fill: true, label: 'Shares', data: cumulative(shares), backgroundColor: 'rgba(245,158,11,0.2)', borderColor: '#f59e0b', tension: 0.4 }
    ]
  };

  useEffect(() => {
    const tabs = ['Overview', 'Posts & Metrics', 'Insights', 'Sentiment', 'Trends', 'Reports', 'Scan'];
    const matchedTab = tabs.find(tab => tab.toLowerCase().includes(searchTerm.toLowerCase()));
    if (matchedTab) setActiveTab(matchedTab);
  }, [searchTerm]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8 transition-all duration-500 animate-fadeIn">
            <Stats />
            <AnalyticsCharts
              reactionBarData={reactionBarData}
              reactionPieData={reactionPieData}
              sentimentData={sentimentData}
              commonOptions={commonOptions}
            />
            <Engagement
              timelineData={timelineData}
              cumulativeData={cumulativeData}
              commonOptions={commonOptions}
            />
          </div>
        );
      case 'Sentiment':
        return <AnalyticsCharts reactionBarData={reactionBarData} reactionPieData={reactionPieData} sentimentData={sentimentData} commonOptions={commonOptions} />;
      case 'Trends':
        return <Engagement timelineData={timelineData} cumulativeData={cumulativeData} commonOptions={commonOptions} />;
      case 'Posts & Metrics':
        return <PostsMetrics />;
      case 'Insights':
        return <Insights />;
      case 'Reports':
        return <Reports />;
      case 'Scan':
        return <Scan />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 transition-all duration-500">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8 transition-all duration-500">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-500">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-800 transition-colors duration-300">
            Date Range Filter
          </h1>
          <p className="text-sm mb-4 text-gray-500 transition-all duration-300">
            Select date range to retrieve and analyze posts
          </p>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full max-w-xl px-4 py-3 rounded-xl text-gray-800 bg-gray-50 cursor-text focus:outline-none transition-all duration-500"
          />
        </div>

        <div className="transition-all duration-500">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="space-y-8 transition-all duration-500">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;