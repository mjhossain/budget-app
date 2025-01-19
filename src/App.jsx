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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TransactionForm 
            formData={formData}
            categories={categories}
            status={status}
            loading={loading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default App;