export function InitializeForm({ sheetId, setSheetId, handleInitialize }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Expense Tracker</h1>
        <form onSubmit={handleInitialize} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Enter Google Sheet ID:
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
            className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 