import React, { useState } from "react";
import { ScanLine, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasResult, setHasResult] = useState(true);

  const result = "positive";

  const resultConfig = {
    positive: {
      label: "Positive",
      color: "green",
      icon: <CheckCircle className="text-green-600" size={24} />,
      bg: "bg-green-100",
      description: "Majority of comments reflect a positive reaction.",
      confidence: "87%",
    },
    neutral: {
      label: "Neutral",
      color: "indigo",
      icon: <AlertCircle className="text-indigo-600" size={24} />,
      bg: "bg-indigo-100",
      description: "Audience reaction is mixed or moderate.",
      confidence: "64%",
    },
    negative: {
      label: "Negative",
      color: "amber",
      icon: <AlertCircle className="text-amber-600" size={24} />,
      bg: "bg-amber-100",
      description: "Content may be perceived negatively.",
      confidence: "72%",
    },
  };

  const current = resultConfig[result];

  const handleScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setHasResult(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ScanLine size={28} className="text-cyan-300" />
          <h2 className="text-2xl font-bold">Content Scanner</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Analyze your content using AI to detect sentiment, engagement potential,
          and optimization opportunities.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Facebook Post URL
            </h3>
            <p className="text-xs text-gray-500">
              Paste the link to a public Facebook post to analyze its comments and sentiment.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative w-full">
              <input
                type="url"
                placeholder="https://www.facebook.com/.../posts/123456789"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                URL
              </span>
            </div>

            <button
              onClick={handleScan}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isScanning ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanLine size={18} />
                  Analyze Post
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
              Public posts only
            </span>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
              Comments will be analyzed
            </span>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
              Sentiment: Positive / Neutral / Negative
            </span>
          </div>

        </div>
      </div>

      {hasResult && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className={`p-3 ${current.bg} rounded-xl`}>
              {current.icon}
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Overall Sentiment
              </p>
              <h3 className="text-xl font-bold text-gray-900">
                {current.label}
              </h3>
              <p className="text-sm text-gray-500">
                {current.description}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Confidence</p>
            <p className={`text-lg font-bold text-${current.color}-600`}>
              {current.confidence}
            </p>
          </div>

        </div>
      )}

      {hasResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle className="text-green-600" size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/50 border border-black/5 text-gray-600">
                Positive
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Positive Sentiment
            </h3>
            <p className="text-gray-600 text-sm">
              Your content shows strong positive tone and engagement potential.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="text-indigo-600" size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/50 border border-black/5 text-gray-600">
                Neutral
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Neutral Signals
            </h3>
            <p className="text-gray-600 text-sm">
              Some parts of your message could be optimized.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="text-amber-600" size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/50 border border-black/5 text-gray-600">
                Negative
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Negative Indicators
            </h3>
            <p className="text-gray-600 text-sm">
              Some feedback suggests negative perception or confusion.
            </p>
          </div>

        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 italic">
          AI scan results are based on NLP sentiment models and engagement heuristics.
        </p>
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
          Clear Results
        </button>
      </div>

    </div>
  );
};

export default Scan;