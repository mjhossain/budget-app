export function TransactionList({ transactions }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
      <div className="overflow-x-auto">
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
            {transactions.map((transaction, index) => (
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
          </tbody>
        </table>
        {transactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">No transactions found</p>
        )}
      </div>
    </div>
  );
} 