export function InitializeForm({ sheetId, setSheetId, handleInitialize }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Welcome to Expense Tracker</h1>
        <form onSubmit={handleInitialize} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter Google Sheet ID:
            </label>
            <input
              type="text"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 1A2B3C4D..."
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              You can find this in your Google Sheet URL
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 