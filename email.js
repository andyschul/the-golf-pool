const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function(error, info){
    error ? console.log(error) : console.log('Email sent: ' + info.response);
  });
}

module.exports = { sendEmail };
