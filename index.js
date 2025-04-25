const nodemailer = require('nodemailer');
const fs = require('fs');
const os = require('os');
require('dotenv').config();


function logToFile(message) {
    fs.appendFile('logs.txt', `${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()} : `+message + '\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
}
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
    }
});
const emailTemplate = fs.readFileSync('email.html', 'utf8');
const personalizedEmail = emailTemplate
    .replace(/{{server_up_time}}/g, `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    .replace(/{{system_name}}/g, os.hostname());

const mailOptions = {
    from: process.env.FROM_MAIL,
    to: process.env.TO_MAIL,
    subject: process.env.SMPT_TITLE,
    html: personalizedEmail
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logToFile(`${error}`);
    } else {
        logToFile(`Email sent: ${info.response}`);
    }
});