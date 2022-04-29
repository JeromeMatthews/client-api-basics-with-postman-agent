const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a Transporter
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '4731107f555cee',
      pass: 'a57d1bbf711c3f',
    },
  });

  //Define the email options
  const mailOptions = {
    from: 'Nile Lakes <nilelakes@seawatch.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
