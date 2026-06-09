require('dotenv').config();
const { sendSMS } = require('./utils/sendSMS');

const adminPhone = process.env.ADMIN_PHONE_NUMBER;

if (!adminPhone) {
    console.error("ADMIN_PHONE_NUMBER is not set in .env");
    process.exit(1);
}

console.log(`Attempting to send a test message to ${adminPhone}...`);

(async () => {
    try {
        await sendSMS(adminPhone, "Test message from Winkin Backend: Your Twilio integration is working!");
        console.log("Message queued! Check the console output above for the success log from Twilio.");
        
        // Wait a couple of seconds for the async queue to process
        setTimeout(() => {
            console.log("Test finished.");
            process.exit(0);
        }, 3000);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
})();
