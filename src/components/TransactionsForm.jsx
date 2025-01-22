export function TransactionsForm({ handleAddTransaction }) {
  // ... existing state and logic ...

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
            placeholder="Enter description"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/20 mt-4"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
} 