function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  // Check if it's a preflight OPTIONS request
  if (e.postData.type === "application/x-www-form-urlencoded") {
    return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Add a check for content type
  if (e.postData.type !== "application/json") {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid content type'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const sheetId = e.parameter.sheetId || e.postData?.sheetId;
    if (!sheetId) {
      throw new Error('Sheet ID is required');
    }

    let result;
    if (e.parameter.action) {
      switch (e.parameter.action) {
        case 'getCategories':
          result = { status: 'success', data: getCategories(sheetId) };
          break;
        case 'getTransactions':
          result = { status: 'success', data: getTransactions(sheetId) };
          break;
        default:
          result = { status: 'error', message: 'Invalid action' };
      }
    } else if (e.postData) {
      const data = JSON.parse(e.postData.contents);
      if (data.action === 'addTransaction') {
        result = { 
          status: 'success', 
          data: addTransaction(sheetId, data.transaction) 
        };
      } else {
        result = { status: 'error', message: 'Invalid action' };
      }
    } else {
      result = { status: 'error', message: 'No action specified' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function getTransactions(sheetId) {
  const spreadsheet = getSheetById(sheetId);
  const sheet = spreadsheet.getSheetByName('Transactions');
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

function addTransaction(sheetId, transaction) {
  const spreadsheet = getSheetById(sheetId);
  const sheet = spreadsheet.getSheetByName('Transactions');

  // Log incoming transaction for debugging
  Logger.log('Transaction data: ' + JSON.stringify(transaction));

  // Validate transaction fields
  const date = transaction.date ? new Date(transaction.date) : null;
  if (!date || isNaN(date)) throw new Error('Invalid or missing date.');

  const amount = transaction.amount || 0;
  const description = transaction.description || 'No Description';
  const category = transaction.category || 'Other';

  // Find the next empty row in column B (starting from row 5)
  let nextRow = 5;
  const lastRow = sheet.getLastRow();
  for (let i = 5; i <= lastRow; i++) {
    if (!sheet.getRange(i, 2).getValue()) {
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
    sheet.getRange(nextRow, 2).setNumberFormat('MM/dd/yyyy');

    return { message: 'Transaction added successfully', row: nextRow };
  } catch (error) {
    throw new Error('Failed to write transaction: ' + error.message);
  }
}

function getCategories(sheetId) {
  const spreadsheet = getSheetById(sheetId);
  const sheet = spreadsheet.getSheetByName('Summary');
  const range = sheet.getRange('B28:B100').getValues();

  return range
    .filter(row => row[0]) // Filter out empty rows
    .map(row => row[0]);   // Return category names
}

function formatDate(date) {
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'M/d/yy');
}

function getSheetById(sheetId) {
  try {
    return SpreadsheetApp.openById(sheetId);
  } catch (error) {
    throw new Error('Invalid Sheet ID or insufficient permissions');
  }
}