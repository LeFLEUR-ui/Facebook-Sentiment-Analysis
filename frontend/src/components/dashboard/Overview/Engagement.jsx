import React from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

const Engagement = ({ timelineData, cumulativeData, commonOptions }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={28} className="text-cyan-300" />
          <h2 className="text-2xl font-bold">Engagement Trends</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Track reactions, comments, and shares over time to understand audience engagement patterns.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Engagement Timeline
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg font-medium">
            Daily Metrics
          </span>
        </div>

        <div className="h-72">
          <Line data={timelineData} options={commonOptions} />
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            Reactions
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            Comments
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Shares
          </span>
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Cumulative Engagement
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg font-medium">
            Growth Trend
          </span>
        </div>

        <div className="h-72">
          <Line data={cumulativeData} options={commonOptions} />
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        <h3 className="text-sm font-semibold text-gray-700 mb-6">
          Trend Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div>
            <p className="text-3xl font-bold text-indigo-600">20,473</p>
            <p className="text-xs text-gray-500 mt-1">Total Reactions</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-green-600">3,687</p>
            <p className="text-xs text-gray-500 mt-1">Total Comments</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-amber-600">1,941</p>
            <p className="text-xs text-gray-500 mt-1">Total Shares</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Engagement;