const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     host:'bh-in-11.webhostbox.net',
//     port:587, 
//     secure: false,  
//     auth: {
//         user:'erp@dev.technians.com',
//         pass:'$8?fbtt0.ZSA',
//     },
//     tls: {
//         rejectUnauthorized: false,
//     },
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



const sendEmail = async (to, subject, htmlContent) => {

    const mailOptions = {
        from:'support@syncspace.com',
        to,
        subject,
        html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);


    console.log("Email sent successfully: %s", info?.accepted);

};

module.exports = sendEmail;
