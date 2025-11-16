require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;

exports.sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      to,
      from: FROM_NUMBER
    });
    console.log("SMS sent:", response.sid);
    return response;
  } catch (err) {
    console.error("Twilio SMS Error:", err);
  }
};

exports.makeCall = async (to, alertMessage) => {
  try {
    const response = await client.calls.create({
      twiml: `<Response><Say>${alertMessage}</Say></Response>`,
      to,
      from: FROM_NUMBER
    });

    console.log("Call placed:", response.sid);
    return response;
  } catch (err) {
    console.error("Twilio Call Error:", err);
  }
};
