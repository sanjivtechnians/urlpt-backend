const nodemailer = require("nodemailer");

const sendEmail = async (option) => {

  // const transporter = nodemailer.createTransport({
  //   host: "bh-in-11.webhostbox.net",
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:465, 
      secure: true,  
      auth: {
          user:'support@syncspace.com',
          pass:'qgme ffpv qdhl yspm',
      },
      tls: {
          rejectUnauthorized: false,
      },
  });
  

  const emailOptions = {
    from: 'support@syncspace.com',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);

};

module.exports = sendEmail;
