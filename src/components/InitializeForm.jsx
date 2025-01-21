import Cookies from 'js-cookie';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Expense Tracker
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="scriptUrl" className="block text-sm font-medium mb-2 text-gray-700">
              Script URL:
            </label>
            <input
              id="scriptUrl"
              type="text"
              value={localScriptUrl}
              onChange={(e) => setLocalScriptUrl(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Script URL"
              required
            />
          </div>
          <div>
            <label htmlFor="sheetId" className="block text-sm font-medium mb-2 text-gray-700">
              Sheet ID:
            </label>
            <input
              id="sheetId"
              type="text"
              value={localSheetId}
              onChange={(e) => setLocalSheetId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Sheet ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Initialize App
          </button>
        </form>
      </div>
    </div>
  );
} 