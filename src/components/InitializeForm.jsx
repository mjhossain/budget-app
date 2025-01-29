import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function InitializeForm({ handleInitialize, setSheetId, setScriptUrl }) {
  const [localSheetId, setLocalSheetId] = useState('');
  const [localScriptUrl, setLocalScriptUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // First update the parent state
    if (typeof setSheetId === 'function') {
      setSheetId(localSheetId);
    }
    if (typeof setScriptUrl === 'function') {
      setScriptUrl(localScriptUrl);
    }
    // Then call handleInitialize with the form data
    handleInitialize({
      sheetId: localSheetId,
      scriptUrl: localScriptUrl
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Landing Content */}
        <div className="space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Take Control of Your <span className="text-blue-600">Finances</span> with BudgetBuddy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            BudgetBuddy is your smart financial companion, helping you track expenses, analyze spending patterns, and achieve your financial goals with ease.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600">Real-time expense tracking and analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">Customizable budget categories and goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-600">Seamless integration with Google Sheets</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Connect Your <span className="text-blue-600">Spreadsheet</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="scriptUrl" className="block text-sm font-medium mb-2 text-gray-600">
                Script URL:
              </label>
              <input
                id="scriptUrl"
                type="text"
                value={localScriptUrl}
                onChange={(e) => setLocalScriptUrl(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 text-gray-800"
                placeholder="Enter Script URL"
                required
              />
            </div>
            <div>
              <label htmlFor="sheetId" className="block text-sm font-medium mb-2 text-gray-600">
                Sheet ID:
              </label>
              <input
                id="sheetId"
                type="text"
                value={localSheetId}
                onChange={(e) => setLocalSheetId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 text-gray-800"
                placeholder="Enter Sheet ID"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/20"
            >
              Open Sheet
            </button>
          </form>
          
          <a 
            href="/help" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full p-3.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-center block mt-6 font-medium shadow-lg hover:shadow-gray-500/20"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
} 