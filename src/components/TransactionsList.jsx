export function TransactionsList({ transactions }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl border border-gray-100 bg-white/50 hover:bg-white transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div className={`text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <p className="font-medium">{transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 