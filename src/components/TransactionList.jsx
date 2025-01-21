export function TransactionList({ transactions, paginatedTransactions, currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
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
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="sticky bottom-0 bg-white py-3 border-t shadow-sm">
        <div className="flex justify-between items-center px-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            &larr; Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
} 