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
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Welcome to <span className="text-blue-600">Expense Tracker</span>
        </h1>
        
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
          Setup Help
        </a>
      </div>
    </div>
  );
} 