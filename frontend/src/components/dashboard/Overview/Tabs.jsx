import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Overview', 'Posts & Metrics', 'Insights', 'Sentiment', 'Trends', 'Reports', 'Scan'];

  return (
    <div className="overflow-x-auto w-full">
      <div className="bg-gray-200 p-1 rounded-xl flex whitespace-nowrap min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;