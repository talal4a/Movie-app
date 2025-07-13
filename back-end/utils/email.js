const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail = async (options) => {
  await transporter.sendMail({
    from: '"Movie App" <no-reply@movieapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });
};
module.exports = sendEmail;
