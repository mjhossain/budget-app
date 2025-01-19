import React from 'react';
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
    isInitialized,
    setSheetId,
    handleInputChange,
    handleSubmit,
    handleInitialize
  } = useExpenseTracker();

  if (!isInitialized) {
    return <InitializeForm 
      sheetId={sheetId} 
      setSheetId={setSheetId} 
      handleInitialize={handleInitialize} 
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
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
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;