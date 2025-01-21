function doGet(e) {
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
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
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
      `${DATA_START_COL}${DATA_START_ROW}:${DATA_END_COL}${lastRow}`
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
          console.error(`Error processing row ${index + DATA_START_ROW}: ${error.message}`);
          return null;
        }
      })
      // Remove any transactions that failed to process
      .filter(transaction => transaction !== null);

    return {
      success: true,
      transactions: transactions,
      count: transactions.length,
      message: `Successfully retrieved ${transactions.length} transactions`
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
}