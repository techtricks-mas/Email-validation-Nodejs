const nodemailer = require("nodemailer");

const sendEmail = async (email, url) => {
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASS
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM, // sender address
      to: email, // list of receivers
      subject: 'Email Verification', // subject line
      text: 'Email Verification',
      html: `<a href="${url}" target="_blank">Verify</a>`
    });
    return `Message sent: ${info.messageId}`;
  } catch (error) {
    console.error(error);
    thrownewError(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};
module.exports = sendEmail; 