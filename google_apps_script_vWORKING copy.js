function doGet(e) {
  const response = handleRequest(e);
  return addCorsHeaders(response);
}

function doPost(e) {
  const response = handleRequest(e);
  return addCorsHeaders(response);
}

function handleRequest(e) {
  try {
    if (e.parameter.action) {
      // Handle GET requests
      switch (e.parameter.action) {
        case 'getCategories':
          return jsonResponse({ status: 'success', data: getCategories() });
        case 'getTransactions':
          return jsonResponse({ status: 'success', data: getTransactions() });
        default:
          return jsonResponse({ status: 'error', message: 'Invalid action' });
      }
    } else if (e.postData) {
      // Handle POST requests
      const data = JSON.parse(e.postData.contents);
      if (data.action === 'addTransaction') {
        const result = addTransaction(data.transaction);
        return jsonResponse({ status: 'success', data: result });
      }
      return jsonResponse({ status: 'error', message: 'Invalid action' });
    }
    return jsonResponse({ status: 'error', message: 'No action specified' });
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

function addCorsHeaders(response) {
  // Add CORS headers to allow requests from any origin
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  Object.keys(headers).forEach(key => {
    response.setHeader(key, headers[key]);
  });
  
  return response;
}

function getTransactions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions');
  const data = sheet.getRange('B5:E' + sheet.getLastRow()).getValues();

  return data
    .filter(row => row[0]) // Exclude empty rows (based on date in column B)
    .map(row => ({
      date: formatDate(row[0]), // Column B - Date
      amount: row[1],           // Column C - Amount
      description: row[2],      // Column D - Description
      category: row[3],         // Column E - Category
    }));
}

function addTransaction(transaction) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions');

  // Log incoming transaction for debugging
  Logger.log('Transaction data: ' + JSON.stringify(transaction));

  // Validate transaction fields
  const date = transaction.date ? new Date(transaction.date) : null;
  if (!date || isNaN(date)) throw new Error('Invalid or missing date.');

  const amount = transaction.amount || 0;
  const description = transaction.description || 'No Description';
  const category = transaction.category || 'Uncategorized';

  // Find the next empty row in column B (starting from row 5)
  let nextRow = 5; // Start from row 5
  const lastRow = sheet.getLastRow();
  for (let i = 5; i <= lastRow; i++) {
    if (!sheet.getRange(i, 2).getValue()) { // Check if column B is empty
      nextRow = i;
      break;
    }
  }
  if (nextRow <= lastRow) nextRow = lastRow + 1;

  // Log the row where the data will be written
  Logger.log(`Writing to row: ${nextRow}`);

  // Write the transaction to columns B-E
  try {
    sheet.getRange(nextRow, 2, 1, 4).setValues([[
      date, amount, description, category
    ]]);

    // Format the date in column B
    sheet.getRange(nextRow, 2).setNumberFormat('M/d/yy');

    return { message: 'Transaction added successfully', row: nextRow };
  } catch (error) {
    throw new Error('Failed to write transaction: ' + error.message);
  }
}

function getCategories() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Summary');
  const range = sheet.getRange('B28:B100').getValues();

  return range
    .filter(row => row[0]) // Filter out empty rows
    .map(row => row[0]);   // Return category names
}

function formatDate(date) {
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'M/d/yy');
}

function jsonResponse(response) {
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
  