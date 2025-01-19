import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMIODq2ejhyHCzPbEYcZVU2q8COHVntIhr0RVfZTEKc-utGFos4NTMhGP0bZRQmS96/exec';

export function useExpenseTracker() {
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
    console.log('Initialization check:', { isInitialized, sheetId });
    if (isInitialized && sheetId) {
      console.log('Fetching data for sheet:', sheetId);
      fetchCategories();
      fetchTransactions();
    }
  }, [isInitialized, sheetId]);

  useEffect(() => {
    const savedSheetId = Cookies.get('sheetId');
    if (savedSheetId) {
      setSheetId(savedSheetId);
      setIsInitialized(true);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch(`${SCRIPT_URL}?action=getCategories&sheetId=${sheetId}`);
      const result = await response.json();
      console.log('Categories response:', result);
      if (result.status === 'success') {
        setCategories(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Categories error:', error);
      setStatus({
        type: 'error',
        message: error.message
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log('Fetching transactions...');
      const response = await fetch(`${SCRIPT_URL}?action=getTransactions&sheetId=${sheetId}`);
      const result = await response.json();
      console.log('Transactions response:', result);
      if (result.status === 'success') {
        setTransactions(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Transactions error:', error);
      setStatus({
        type: 'error',
        message: error.message
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
        setFormData(prev => ({
          ...prev,
          amount: '',
          description: '',
          category: ''
        }));
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
      Cookies.set('sheetId', sheetId, { expires: 365 });
      setIsInitialized(true);
    }
  };

  return {
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
  };
} 