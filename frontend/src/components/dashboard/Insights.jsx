import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Target, ArrowUpRight } from 'lucide-react';

const Insights = () => {
  const insightCards = [
    {
      title: "Peak Engagement Time",
      description:
        "Your posts receive 40% more interactions between 6:00 PM and 8:00 PM. Consider scheduling your next 'Product Launch' post during this window.",
      icon: <TrendingUp className="text-green-600" size={24} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      tag: "Opportunity",
      url: "https://datareportal.com/social-media-users"
    },
    {
      title: "Content Sentiment Shift",
      description:
        "Negative sentiment increased by 5% this week. Most comments relate to 'shipping delays' mentioned in Post-58. A proactive update might mitigate this.",
      icon: <AlertCircle className="text-amber-600" size={24} />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      tag: "Attention Required",
      url: "https://dl.acm.org/doi/10.1145/3672608.3707717"
    },
    {
      title: "Top Performing Format",
      description:
        "Image-based posts with 'Inspirational Quotes' have a 2.5x higher share rate than text-only updates. Doubling down on visual content is recommended.",
      icon: <Target className="text-indigo-600" size={24} />,
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      tag: "Strategy",
      url: "https://buffer.com/resources/data-best-content-format-social-media/"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb size={28} className="text-yellow-300" />
          <h2 className="text-2xl font-bold">AI Smart Insights</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          We've analyzed your 62 most recent posts. Here are the key patterns and actionable 
          recommendations to improve your social media presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insightCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.bgColor} border ${card.borderColor} rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/50 border border-black/5 text-gray-600">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
            
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
            >
              View Detailed Data <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 italic">
          Next automated analysis scheduled for April 05, 2026 at 12:00 AM.
        </div>
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
          Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default Insights;
