import Cookies from 'js-cookie';

export function InitializeForm({ sheetId, setSheetId, handleInitialize }) {
  const savedSheetId = Cookies.get('sheetId');
  
  const handleUseSaved = () => {
    setSheetId(savedSheetId);
    handleInitialize({ preventDefault: () => {} });
  };

  const handleClearSaved = () => {
    Cookies.remove('sheetId');
    setSheetId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {savedSheetId ? 'Change Google Sheet' : 'Welcome to Expense Tracker'}
        </h1>
        
        {savedSheetId && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Continue with saved sheet?</h2>
            <div className="space-y-3">
              <button
                onClick={handleUseSaved}
                className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Use Saved Sheet
              </button>
              <button
                onClick={handleClearSaved}
                className="w-full p-3 text-sm text-gray-600 underline hover:text-gray-800"
              >
                Clear Saved Sheet
              </button>
              <div className="text-center text-gray-500">or</div>
            </div>
          </div>
        )}

        <form onSubmit={handleInitialize} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {savedSheetId ? 'Enter new Google Sheet ID:' : 'Enter Google Sheet ID:'}
            </label>
            <input
              type="text"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 1A2B3C4D..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              You can find this in your Google Sheet URL
            </p>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            {savedSheetId ? 'Use New Sheet' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
} 