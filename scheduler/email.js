const sgMail = require('@sendgrid/mail')
const User = require('./models/user');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


async function sendEmail(mailOptions) {
  if (mailOptions.to === 'all') {
    const users = await User.find({active: true});
    mailOptions.to = users.map(user => user.email).join(',');
  }
  sgMail
    .send(mailOptions)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = { sendEmail };
