const nodemailer = require("nodemailer");
const User = require('./models/user');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(mailOptions) {
  if (mailOptions.to === 'all') {
    const users = await User.find({});
    mailOptions.to = users.map(user => user.email).join(',');
  }
  transporter.sendMail(mailOptions, function(error, info){
    error ? console.log(error) : console.log('Email sent: ' + info.response);
  });
}

module.exports = { sendEmail };
