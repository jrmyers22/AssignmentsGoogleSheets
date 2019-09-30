# Assignments - Google Sheets
This is a digital planner of sorts, meant to help organize and notify university course information such as class portal URLs, classroom information, and of course assignment titles, descriptions, and due dates. In the past 4 years of university, the script (available in this repo at RUNNING.js) has been expanded to include automated email and SMS notifications (thanks to Twilio), the automated color-coding of assignments based on the number of days left to complete them, and automated removal of assignments once they are both completed and marked done. Examples of all of the aforementioned features can be found below.

## On Page Load

**This GIF is slowed down immensely due to Github GIF-processing - it only takes a second or two in real time**
![color_and_popup](https://user-images.githubusercontent.com/17054668/65897566-8bf4bc80-e37d-11e9-95cc-e91cf1c8a341.gif)
Once the page loads, the sheet first color codes the assignments (above 5 days left - white background, between 3 and 5 days left - orange background, under 3 days left - red background). After color coding the assignments, a popup is displayed showing the assignments due in the next 5 days. 

## Another look at the initial popup
<img width="1249" alt="popup" src="https://user-images.githubusercontent.com/17054668/65898049-b5faae80-e37e-11e9-8074-34c549f942f5.png">
Unlike the body of the SMS message or email (example below), the initial popup does not show the class that the assignment is associated with. This popup exists simply to give the user an idea of how many assignments are due in the 5 days at a glance.

## Automated Past-Due Removal
Once the page loads, the script automatically checks to see if an assignment exists which BOTH is past-due and also "marked done" (meaning the background has been set to green). If it encounters 1 or more, it will display a popup and allow the user to remove these assignments from the spreadsheet with one click of the button.
