export function TransactionList({ transactions }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-black">{transaction.date}</td>
                <td className="px-4 py-2 text-black">{transaction.amount}</td>
                <td className="px-4 py-2 text-black">{transaction.description}</td>
                <td className="px-4 py-2 text-black">{transaction.category}</td>
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