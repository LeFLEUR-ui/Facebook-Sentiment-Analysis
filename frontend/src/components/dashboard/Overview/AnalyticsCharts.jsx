import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';

const AnalyticsCharts = ({ reactionBarData, reactionPieData, sentimentData, commonOptions }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={28} className="text-cyan-300" />
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Visualize engagement, reactions, and sentiment trends across your analyzed Facebook posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Reactions
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg font-medium">
              Total 20,282
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

            <div className="h-48">
              <Pie 
                data={reactionPieData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>

            <div className="space-y-3">
              {[
                { label: 'Like', value: '10,222', color: 'bg-indigo-500' },
                { label: 'Love', value: '5,094', color: 'bg-pink-500' },
                { label: 'Haha', value: '2,019', color: 'bg-amber-500' },
                { label: 'Wow', value: '1,612', color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-600 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>

          <div className="h-40 mt-8">
            <Bar data={reactionBarData} options={commonOptions} />
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Sentiment
            </h2>

            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
              Overall Positive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="h-56">
              <Pie 
                data={sentimentData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom', 
                      labels: { boxWidth: 10, font: { size: 10 } } 
                    } 
                  } 
                }} 
              />
            </div>

            <div className="h-56">
              <Bar data={sentimentData} options={commonOptions} />
            </div>

          </div>

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            Current sentiment is trending{" "}
            <span className="text-green-600 font-semibold">
              upwards
            </span>. Community reactions remain favorable with minimal neutral friction.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AnalyticsCharts;