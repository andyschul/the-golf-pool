const nodemailer = require("nodemailer");
const User = require('./models/user');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(mailOptions) {
  const users = await User.find({});

  if (mailOptions.to === 'all') {
    mailOptions.to = users.map(user=>user.email).join();
  }

  transporter.sendMail(mailOptions, function(error, info){
    error ? console.log(error) : console.log('Email sent: ' + info.response);
  });
}

module.exports = { sendEmail };
