const { EmailClient } = require("@azure/communication-email");
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const User = require('./models/user');

const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);

async function sendEmail(message) {
  try {
    if (message.recipients.to === 'all') {
      const users = await User.find({active: true});
      message.recipients.to = users.map(user => {
        const displayName = user.first_name ? `${user.first_name} ${user.last_name}` : `${user.username}`;
        return {
          address: user.email,
          displayName: displayName,
        }
      });
    }
    console.log(JSON.stringify(message))
    const poller = await emailClient.beginSend(message);
    const response = await poller.pollUntilDone();
    console.log(response)
  } catch (e) {
    console.log(e);
  }
}
  
module.exports = { sendEmail };
