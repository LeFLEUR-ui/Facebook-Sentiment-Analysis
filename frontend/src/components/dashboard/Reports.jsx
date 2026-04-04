import React from 'react';
import { FileText, Download, Printer, CheckCircle2 } from 'lucide-react';

const Reports = () => {
  const reportItems = [
    "Executive summary with key metrics",
    "Post-by-post performance details",
    "Reaction and sentiment breakdown",
    "Administrator insights and notes",
    "Engagement trends over time",
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={28} className="text-cyan-300" />
          <h2 className="text-2xl font-bold">Reports & Export</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Generate, export, and print analytics reports including sentiment insights,
          engagement metrics, and performance summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <Download size={18} />
            <h3 className="font-bold">CSV Export</h3>
          </div>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Download detailed analytics data in CSV format for further analysis in Excel or other tools.
          </p>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition text-sm font-semibold">
            <Download size={16} />
            Export to CSV
          </button>

          <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-wider">
            FR-19: Export summaries
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <Printer size={18} />
            <h3 className="font-bold">Printable Report</h3>
          </div>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Generate a formatted report optimized for printing or saving as PDF.
          </p>

          <button className="w-full border border-gray-300 text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-semibold">
            <Printer size={16} />
            View Printable Report
          </button>

          <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-wider">
            FR-20: Printable views
          </p>
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Report Contents
        </h4>

        <ul className="space-y-3">
          {reportItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-600 text-sm"
            >
              <CheckCircle2 className="text-indigo-500 mt-0.5" size={16} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 italic">
          Reports include aggregated analytics, sentiment summaries, and engagement trends based on selected data.
        </p>

        <button className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
          Refresh Data
        </button>
      </div>

    </div>
  );
};

export default Reports;