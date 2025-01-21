import { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';


// working
// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhjwvAMEBcsDU2CVFJv1DMezOjd2DTvqMxoSWwg_d8lVt7EUuH1j5IoHQ95D39EFsq/exec';

// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXh4bM9PA7-mKkKXEkaanwXpSOKXbffSVpUYxG6aaZMYxCfo3Wf5FPGA-JLBC6kbou/exec';


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
  const [scriptUrl, setScriptUrl] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const savedSheetId = Cookies.get('sheetId');
    const savedScriptUrl = Cookies.get('scriptUrl');
    
    // Only set as initialized if BOTH values exist
    if (savedSheetId && savedScriptUrl) {
      setSheetId(savedSheetId);
      setScriptUrl(savedScriptUrl);
      setIsInitialized(true);
    } else {
      // If either is missing, clear both and show initialization form
      Cookies.remove('sheetId');
      Cookies.remove('scriptUrl');
      setIsInitialized(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && sheetId && scriptUrl) {
      fetchCategories();
      fetchTransactions();
    }
  }, [isInitialized, sheetId, scriptUrl]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch(`${scriptUrl}?sheetId=${sheetId}&action=getCategories`);
      const result = await response.json();
      console.log('Categories response:', result);
      if (result.success) {
        setCategories(result.categories);
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
      const response = await fetch(`${scriptUrl}?sheetId=${sheetId}&action=getTransactions`);
      const result = await response.json();
      console.log('Transactions response:', result);
      if (result.success) {
        setTransactions(result.transactions.reverse());
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
      const url = new URL(scriptUrl);
      url.searchParams.append('sheetId', sheetId);
      url.searchParams.append('date', formData.date);
      url.searchParams.append('amount', formData.amount);
      url.searchParams.append('description', formData.description);
      url.searchParams.append('category', formData.category);
  
      const response = await fetch(url, {
        method: 'POST'
      });
  
      const result = await response.json();
  
      if (result.success) {
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
        throw new Error(result.error || 'Failed to add transaction');
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

  const handleInitialize = (data) => {
    if (data.sheetId && data.scriptUrl) {
      Cookies.set('sheetId', data.sheetId, { expires: 365 });
      Cookies.set('scriptUrl', data.scriptUrl, { expires: 365 });
      setIsInitialized(true);
    } else {
      setStatus({
        type: 'error',
        message: 'Both Sheet ID and Script URL are required'
      });
    }
  };

  const resetApp = () => {
    Cookies.remove('sheetId');
    Cookies.remove('scriptUrl');
    setSheetId('');
    setScriptUrl('');
    setIsInitialized(false);
    setTransactions([]);
    setCategories([]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: '',
      category: ''
    });
  };

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return {
    formData,
    categories,
    transactions,
    status,
    loading,
    sheetId,
    scriptUrl,
    setScriptUrl,
    isInitialized,
    setSheetId,
    handleInputChange,
    handleSubmit,
    handleInitialize,
    resetApp,
    paginatedTransactions,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage
  };
} 