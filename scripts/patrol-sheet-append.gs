/**
 * Google Apps Script — append patrol rows from your Next.js API.
 *
 * 1. Create a Google Sheet with header row:
 *    Date | Time | Bluetooth MAC | Name | Location | ESP ID | Guard ID | Status | Received (ISO)
 * 2. Extensions → Apps Script → paste this file → save.
 * 3. Deploy → New deployment → Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone (ESP32 / server sends HTTPS; you can restrict later)
 * 4. Copy the Web App URL into .env.local as GOOGLE_SHEETS_WEBAPP_URL=...
 */
function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonOut({ ok: false, error: 'no body' });
  }
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'invalid json' });
  }

  // Always write to the first sheet tab (your sheet URL uses gid=0).
  // Write by header name so column order in the sheet doesn't matter.
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  var values = new Array(lastCol).fill('');

  function put(headerName, v) {
    if (!v) return;
    var idx = headers.findIndex(function (h) {
      return String(h).trim().toLowerCase() === String(headerName).trim().toLowerCase();
    });
    if (idx >= 0) values[idx] = v;
  }

  put('Date', data.date);
  put('Time', data.time);
  put('Bluetooth MAC', data.bluetoothMac);
  put('MAC', data.bluetoothMac);
  put('Name', data.name);
  put('Location', data.location);
  put('ESP ID', data.espId);
  put('Guard ID', data.guardId);
  put('Status', data.status);
  put('Received', data.receivedAt);

  sheet.appendRow(values);

  return jsonOut({ ok: true });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
