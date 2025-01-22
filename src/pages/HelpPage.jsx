import React, { useState } from 'react';

export default function HelpPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = `function doGet(e) {
  if (!e.parameter.sheetId) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Sheet ID is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let result;
    switch (e.parameter.action) {
      case 'getCategories':
        result = getCategories(e.parameter.sheetId);
        break;
      case 'getTransactions':
        result = getTransactions(e.parameter.sheetId);
        break;
      default:
        result = { error: 'Invalid action' };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  if (!e.parameter.sheetId) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Sheet ID is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const result = addTransaction(e.parameter.sheetId, {
      date: e.parameter.date,
      amount: e.parameter.amount,
      description: e.parameter.description,
      category: e.parameter.category
    });
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getCategories(sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Summary');
  const lastRow = sheet.getLastRow();
  
  const categories = sheet.getRange('B28:C' + lastRow)
    .getValues()
    .flat()
    .filter(category => category !== '');
    
  return {
    success: true,
    categories: categories
  };
}

/**
 * Retrieves all transactions from the Transactions sheet
 * @param {string} sheetId - The ID of the Google Sheet
 * @returns {Object} Object containing success status and transactions array
 */
function getTransactions(sheetId) {
  try {
    // Constants for sheet structure
    const SHEET_NAME = 'Transactions';
    const DATA_START_ROW = 5;
    const DATA_START_COL = 'B';
    const DATA_END_COL = 'E';
    
    // Get the sheet
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    if (!spreadsheet) {
      throw new Error('Could not find spreadsheet with provided ID');
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(\`Sheet "\${SHEET_NAME}" not found\`);
    }

    // Get the last row that has data
    const lastRow = sheet.getLastRow();

    // If we don't have any data rows yet (only headers)
    if (lastRow < DATA_START_ROW) {
      return {
        success: true,
        transactions: [],
        message: 'No transactions found'
      };
    }

    // Get all transaction data
    const range = sheet.getRange(
      \`\${DATA_START_COL}\${DATA_START_ROW}:\${DATA_END_COL}\${lastRow}\`
    );
    
    const values = range.getValues();

    // Process and format the transactions
    const transactions = values
      // Remove empty rows (where date is empty)
      .filter(row => row[0] !== null && row[0] !== '')
      // Map each row to a transaction object
      .map((row, index) => {
        try {
          // Extract values
          const [dateValue, amount, description, category] = row;

          // Format date
          let formattedDate;
          if (dateValue instanceof Date) {
            formattedDate = Utilities.formatDate(
              dateValue,
              Session.getScriptTimeZone(),
              'yyyy-MM-dd'
            );
          } else {
            // If it's not a Date object, try to parse it
            const parsedDate = new Date(dateValue);
            if (isNaN(parsedDate.getTime())) {
              throw new Error('Invalid date format');
            }
            formattedDate = Utilities.formatDate(
              parsedDate,
              Session.getScriptTimeZone(),
              'yyyy-MM-dd'
            );
          }

          // Validate and format amount
          const formattedAmount = typeof amount === 'number' 
            ? amount 
            : parseFloat(amount);
          
          if (isNaN(formattedAmount)) {
            throw new Error('Invalid amount format');
          }

          // Create transaction object
          return {
            id: index + DATA_START_ROW, // Row number as ID
            date: formattedDate,
            amount: formattedAmount,
            description: description || '',
            category: category || ''
          };
        } catch (error) {
          // Log the error but don't break the entire process
          console.error(\`Error processing row \${index + DATA_START_ROW}: \${error.message}\`);
          return null;
        }
      })
      // Remove any transactions that failed to process
      .filter(transaction => transaction !== null);

    return {
      success: true,
      transactions: transactions,
      count: transactions.length,
      message: \`Successfully retrieved \${transactions.length} transactions\`
    };

  } catch (error) {
    console.error('Error in getTransactions:', error);
    return {
      success: false,
      error: error.message,
      transactions: []
    };
  }
}

function addTransaction(sheetId, data) {
  try {
    // Input validation
    if (!data.date || !data.amount || !data.description || !data.category) {
      throw new Error('Missing required transaction data');
    }
    
    // Get the sheet
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Transactions');
    const lastRow = sheet.getLastRow();
    
    // Format the date to MM/dd/yyyy
    const dateObj = new Date(data.date);
    const formattedDate = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'MM/dd/yyyy');
    
    // Add the new transaction starting from column B (2)
    sheet.getRange(lastRow + 1, 2, 1, 4).setValues([[
      formattedDate,             // Column B - Date
      parseFloat(data.amount),   // Column C - Amount
      data.description,          // Column D - Description
      data.category             // Column E - Category
    ]]);
    
    return {
      success: true,
      message: 'Transaction added successfully'
    };
  } catch (error) {
    console.error('Error in addTransaction:', error);
    return {
      success: false,
      error: error.message
    };
  }
}`;

    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(() => alert('Failed to copy code'));
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="w-full max-w-none mx-0">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
            Setup Guide
          </h1>
          
          <div className="space-y-8 w-full">
            {/* Step 1 */}
            <div className="bg-gray-50 p-6 rounded-lg w-full relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                1. Create Google Apps Script
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
                <li>Open your Google Sheet</li>
                <li>Go to Extensions → Apps Script</li>
                <li>Delete any existing code and paste the following:</li>
              </ol>
              <div className="relative">
                <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto text-sm text-gray-700 w-full">
                  {`function doGet(e) {
  if (!e.parameter.sheetId) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Sheet ID is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let result;
    switch (e.parameter.action) {
      case 'getCategories':
        result = getCategories(e.parameter.sheetId);
        break;
      case 'getTransactions':
        result = getTransactions(e.parameter.sheetId);
        break;
      default:
        result = { error: 'Invalid action' };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
.................
Click on the COPY button to copy the full code to your clipboard :) `}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors text-gray-700"
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-6 rounded-lg w-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                2. Deploy as Web App
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
                <li>Click "Deploy" → "New deployment"</li>
                <li>Select "Web app"</li>
                <li>Set "Execute as" to "Me"</li>
                <li>Set "Who has access" to "Anyone"</li>
                <li>Click Deploy</li>
                <li>Copy the Web App URL</li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-6 rounded-lg w-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                3. Connect to Expense Tracker
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
                <li>Open Expense Tracker</li>
                <li>Go to Settings</li>
                <li>Paste the Web App URL in the Script URL field</li>
                <li>Enter your Google Sheet ID</li>
                <li>Click Initialize</li>
              </ol>
            </div>

            {/* Notes */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 w-full">
              <h3 className="font-semibold mb-2 text-yellow-800">
                Important Notes:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-700 pl-4">
                <li>Your Google Sheet must have the following columns: Date, Amount, Description, Category</li>
                <li>The first row should contain headers</li>
                <li>Make sure your Google Sheet is shared with "Anyone with the link can view"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 