# Assignments - Google Sheets
This is a digital planner of sorts, meant to help organize and notify university course information such as class portal URLs, classroom information, and of course assignment titles, descriptions, and due dates. In the past 4 years of university, the script (available in this repo at RUNNING.js) has been expanded to include automated email and SMS notifications (thanks to Twilio), the automated color-coding of assignments based on the number of days left to complete them, and automated removal of assignments once they are both completed and marked done. Examples of all of the aforementioned features can be found below.

## On Page Load

**_This GIF is slowed down immensely due to Github GIF-processing - it only takes a second or two in real time_**
![updated](https://user-images.githubusercontent.com/17054668/65902831-40e0a680-e389-11e9-9ffc-03205a7e49c8.gif)
Once the page loads, the sheet first color codes the assignments (above 5 days left - white background, between 3 and 5 days left - orange background, under 3 days left - red background). After color coding the assignments, a popup is displayed showing the assignments due in the next 5 days. 

## Another look at the initial popup
<img width="1249" alt="popup" src="https://user-images.githubusercontent.com/17054668/65898049-b5faae80-e37e-11e9-8074-34c549f942f5.png">
Unlike the body of the SMS message or email (example below), the initial popup does not show the class that the assignment is associated with. This popup exists simply to give the user an idea of how many assignments are due in the 5 days at a glance.

## Automated SMS Text Notifications via Scheduled Trigger
By leveraging the Twilio (free trial) API, I was able to achieve SMS text notifications daily which contained the assignments due in the next 5 days. In RUNNING.js, you can find this code in the "sendSMS" function, which is called in the body of the overarching "assembleData" function.

This results in a daily text which looks like this (the "Sent from your Twilio free trial account" text at the beginning of the text would not be present if I upgraded to the "Pro" version of the service):
<img width="1280" alt="messageExample" src="https://user-images.githubusercontent.com/17054668/65902558-b6984280-e388-11e9-85fe-6c75f88debac.png">

Using the G Suite Developer hub associated with the project, we can call the "assembleData" function daily within a given time window, 7-8am in this example.
<img width="1279" alt="Screen Shot 2019-09-30 at 12 22 08 PM" src="https://user-images.githubusercontent.com/17054668/65902030-68367400-e387-11e9-99ea-de00996bc18c.png">

## Automated Past-Due Removal
Once the page loads, the script automatically checks to see if an assignment exists which BOTH is past-due and also "marked done" (meaning the background has been set to green). If it encounters 1 or more, it will display a popup and allow the user to remove these assignments from the spreadsheet with one click of the button.
<img width="1278" alt="removal1" src="https://user-images.githubusercontent.com/17054668/65898325-46d18a00-e37f-11e9-985b-f7b9c414b14e.png">
<img width="1280" alt="removal2" src="https://user-images.githubusercontent.com/17054668/65901489-50122500-e386-11e9-8ace-97aaf09f6491.png">
<img width="1280" alt="removal3" src="https://user-images.githubusercontent.com/17054668/65901520-5b655080-e386-11e9-856b-4c619108b0dc.png">
