import React from 'react';
import { FileText, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const Stats = () => {
  const statData = [
    { 
      label: 'Total Posts', 
      value: '62', 
      icon: <FileText size={18} className="text-indigo-600" />,
      trend: 'retrieved (FR-03)',
    },
    { 
      label: 'Total Reactions', 
      value: '20,473', 
      icon: <ThumbsUp size={18} className="text-indigo-600" />,
      trend: '+12% from last month',
    },
    { 
      label: 'Total Comments', 
      value: '3,687', 
      icon: <MessageSquare size={18} className="text-indigo-600" />,
      trend: 'Average 59 / post',
    },
    { 
      label: 'Total Shares', 
      value: '1,941', 
      icon: <Share2 size={18} className="text-indigo-600" />,
      trend: '9.4% engagement rate',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statData.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border-l-indigo-500 transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className="p-2 bg-gray-50 rounded-xl flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-1">
            {stat.value}
          </h3>

          <p className="text-xs md:text-sm text-gray-500 font-medium">
            {stat.trend}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;