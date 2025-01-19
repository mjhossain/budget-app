export function TransactionList({ transactions, paginatedTransactions, currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
      <div className="overflow-x-auto" style={{ minHeight: '600px' }}>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm text-gray-800">{transaction.date}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  <span className={`px-2 py-1 rounded-full ${
                    parseFloat(transaction.amount) < 0 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    ${transaction.amount}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{transaction.description}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {transaction.category}
                  </span>
                </td>
              </tr>
            ))}
            
            {/* Add empty rows to maintain consistent height */}
            {Array.from({ length: 10 - paginatedTransactions.length }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b">
                <td className="px-4 py-3 text-sm text-transparent">-</td>
                <td className="px-4 py-3 text-sm text-transparent">-</td>
                <td className="px-4 py-3 text-sm text-transparent">-</td>
                <td className="px-4 py-3 text-sm text-transparent">-</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">No transactions found</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 