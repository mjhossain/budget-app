import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Replace this with your Google Apps Script deployment URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVfJB_17JukQaD0rBKZsWeYcW6OyOCv1DNhiLGS8sx_QTHfRT9fZxs5BpcIUV2dwyj/exec';

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized && sheetId) {
      fetchCategories();
      fetchTransactions();
    }
  }, [isInitialized, sheetId]);

  // Load sheet ID from cookie on mount
  useEffect(() => {
    const savedSheetId = Cookies.get('sheetId');
    if (savedSheetId) {
      setSheetId(savedSheetId);
      setIsInitialized(true);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getCategories&sheetId=${sheetId}`);
      const result = await response.json();
      if (result.status === 'success') {
        setCategories(result.data);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to fetch categories'
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getTransactions&sheetId=${sheetId}`);
      const result = await response.json();
      if (result.status === 'success') {
        setTransactions(result.data);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to fetch transactions'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'addTransaction',
          sheetId: sheetId,
          transaction: formData
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        setStatus({
          type: 'success',
          message: 'Transaction added successfully!'
        });
        // Reset form except for the date
        setFormData(prev => ({
          ...prev,
          amount: '',
          description: '',
          category: ''
        }));
        // Refresh transactions list
        fetchTransactions();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to add transaction'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = (e) => {
    e.preventDefault();
    if (sheetId) {
      Cookies.set('sheetId', sheetId, { expires: 365 }); // Save for 1 year
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {status.message && (
                <div className={`p-4 rounded-md ${
                  status.type === 'error' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 text-white rounded-md ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">{transaction.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{transaction.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{transaction.category}</td>
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
      </div>
    </div>
  );
}

export default App;