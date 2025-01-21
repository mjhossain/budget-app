import React, { useState } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { InitializeForm } from './components/InitializeForm';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';

function App() {
  const {
    formData,
    categories,
    transactions,
    status,
    loading,
    sheetId,
    scriptUrl,
    isInitialized,
    setSheetId,
    setScriptUrl,
    handleInputChange,
    handleSubmit,
    handleInitialize,
    resetApp,
    paginatedTransactions,
    currentPage,
    setCurrentPage,
    totalPages
  } = useExpenseTracker();

  const [showChangeSheet, setShowChangeSheet] = useState(false);

  if (!isInitialized || showChangeSheet) {
    return <InitializeForm 
      sheetId={sheetId} 
      setSheetId={setSheetId} 
      setScriptUrl={setScriptUrl}
      handleInitialize={handleInitialize}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
          <button
            onClick={() => setShowChangeSheet(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Change Sheet
          </button>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <TransactionForm 
              formData={formData}
              categories={categories}
              status={status}
              loading={loading}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Transactions */}
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions}
              paginatedTransactions={paginatedTransactions}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;