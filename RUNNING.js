// Class Variables
var completedColor = "#00ff00"; // green
var whiteColor = "#FFFFFF";
var redColor = "#fb0006";
var orangeColor = "#fa850a";
var emailAddress = "PERSONAL_EMAIL_TAKEN_OUT_FOR_PRIVACY";  
var subject = "Due in the next 5 days:";
var message_end = "View the spreadsheet for more details: " 
      + "\n https://docs.google.com/spreadsheets/d/1Rkev7bb"
      + "WFfg_TBqqYzHAA-BUxmbEnP7oonLMdedapCk/edit#gid=0";

/*
 * Displays an alert on open letting you know what 
 * assignments are due this week, corrects the colors
 * of the "days 'til" cells, sends an email with the details.
 */
function onOpen() {
  
  // updates the days 'til cell backgrounds
  correctColors();
  
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  Logger.log(sheet)
  var rows = sheet.getLastRow();
  var hasNegatives = false;
  var i = 1;
  var assignments = "";
  var isDueSoon = false;
  var counter = 0;
  var pastCounter = 0;

  //Check Column E for a negative value, update boolean
  while (i < rows) {
    var range = sheet.getRange(i, 5);
    var data = range.getValue();
    var titleRange = sheet.getRange(i, 3);
    var titleData = titleRange.getValue();
    var bgRange = sheet.getRange(i,4);
    var dataRange = sheet.getRange(i, 5);
    var bg = bgRange.getBackgrounds();
    if (data < 0 && (bg == completedColor)) { // Trigger the Negatives box
      hasNegatives = true;
      pastCounter++;
    } else if (data > 0 && data < 5) { // Trigger the Upcoming Assignments box
      if (bg != completedColor) {
         isDueSoon = true;
         counter++;
         assignments += titleData + "\n ";
      }
    }
    if (data > 5 && bg != completedColor) {
      dataRange.setBackground(whiteColor);
    }
    i++;
  }
  
  // Asks the user if they want to remove the completed assignment that is past due
  if (hasNegatives) {
    var response = ui.alert('There are ' + pastCounter + ' COMPLETED assignment[s] which have due dates that have already passed.\n Would you like to remove them?', ui.ButtonSet.YES_NO);
    var j = 1;
    if (response == ui.Button.YES) {
      
      ///// TODO: Figure out how to move the entries up by one row      
      while (j < rows) {
        var range = sheet.getRange(j, 5);
        var data = range.getValue();
        var bgRange = sheet.getRange(j,4);
        var bg = bgRange.getBackgrounds();
        if (data < 0 && (bg == completedColor)) {
          Logger.log('Negative detected, going to delete this entry');
          sheet.getRange(j, 3).clearContent(); // Remove the name of assignment
          sheet.getRange(j, 3).setBackground(whiteColor);
          sheet.getRange(j, 4).clearContent(); //Remove the Due Date
          sheet.getRange(j, 4).setBackground(whiteColor);
          sheet.getRange(j, 5).clearContent(); //Remove the days 'til
          sheet.getRange(j, 5).setBackground(whiteColor);
        } 
        j++;
      }
    } 
  }
  
  // Display the dialog box talking about the next assignments
  if (isDueSoon) {
    var response = ui.alert("Due This Week", counter + " Assignments: \n" + assignments, ui.ButtonSet.OK);
  }  
  
  // Call the function that sends the email daily at 7am
  assembleData();

}

/**
 * Loops through the "days 'til" column and sets the 
 * correct cell background colors. Removes the need
 * for shotty/unreliable conditional formatting.
 */
function correctColors() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rows = sheet.getLastRow();
  var i = 1;
  while (i < rows) {
    var range = sheet.getRange(i, 5);
    var data = range.getValue();
    var titleRange = sheet.getRange(i, 3);
    var titleData = titleRange.getValue();
    var bgRange = sheet.getRange(i,4);
    var dataRange = sheet.getRange(i, 5);
    var bg = bgRange.getBackgrounds();
    if (data > 0 && data < 5 && bg != completedColor) {
      if (data < 3 && dataRange.getBackground() != redColor) {
        titleRange.setBackground(redColor);
        bgRange.setBackground(redColor);
        dataRange.setBackground(redColor); // Setting to red
      } else if (data > 3 && data < 5 && dataRange.getBackground() != orangeColor) {
        titleRange.setBackground(orangeColor);
        bgRange.setBackground(orangeColor);
        dataRange.setBackground(orangeColor); // Setting to orange
      }
    } else if (data > 5 && bg != completedColor) {
        titleRange.setBackground(whiteColor);
        bgRange.setBackground(whiteColor);
        dataRange.setBackground(whiteColor); // Setting to white
    }
    i++;
  }
}

/*
 * UPDATE: Now sends a single email with bulleted assignments.
 * Sends an email containing the assignments due in 
 * under 5 days that are not completed (not marked green).
 *
 * If I was planning on distributing this as an add-on,
 * I would prompt an input box for their email using 
 * the onInstall(e) method.
 */
function assembleData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rows = sheet.getLastRow();
  var i = 1;
  var assignmentCounter = 0;
  var message = "";
  
  // Check for filled cell, less than 5, and bgcolor not green
  while (i < rows) {
    var range = sheet.getRange(i,5); 
    var data = range.getValue();
    var bgRange = sheet.getRange(i,4);
    var bg = bgRange.getBackgrounds(); // Get background color
    if (data != "" && data < 5 && !(bg == completedColor)) {
      assignmentCounter++;
      var range2 = sheet.getRange(i,3); 
      var title = range2.getValue();
      var range3 = sheet.getRange(i,1); 
      var class = range3.getValue();
      
      // TODO: Sort the assignments by least -> most time left
      message += "• " + class + ": " + title + " due in " + data + " days.\n\n";
    }
    i++;
  }
  
  // If there are assignments coming up,
  // sends an SMS containing the assignments
  if (assignmentCounter > 0) {
    message += "\n" + message_end;
    Logger.log("Message:\n " + message);
    //sendEmail(message);
    sendSMS(message);
  } else {
    Logger.log("No assignments coming up"); 
  }
}

/**
 * Uses the Google MailApp object to send an email
 * 
 * @param message assembled from the spreadsheet
 */
function sendEmail(message) {
  MailApp.sendEmail(emailAddress, subject, message);
}

/**
 * Sends an SMS to a personal device via Twilio api
 *
 * @param body message body assembled from the spreadsheet
 */
function sendSMS(body) {
  var messages_url = "TWILIO_API_URL_TAKEN_OUT_FOR_PRIVACY";
  
  var payload = {
    "To": "+PERSONAL_NUMBER_TAKEN_OUT_FOR_PRIVACY",
    "Body" : body,
    "From" : "+TWILIO_NUM_TAKEN_OUT_FOR_PRIVACY"
  };

  var options = {
    "method" : "post",
    "payload" : payload
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode("KEY_TAKEN_OUT_FOR_PRIVACY")
  };

  UrlFetchApp.fetch(messages_url, options);
}

