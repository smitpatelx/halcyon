const nodemailer = require("nodemailer");

let config = ()=>{
    switch(process.env.MAIL_DRIVER) {
        case "mailtrap":
            return {
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_PORT,
                secure: process.env.MAILTRAP_SECURE=='true', // true for 465, false for other ports
                auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_CREDENTIALS,
                },
            }
            break;
        default:
            return {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: process.env.MAIL_SECURE=='true', // true for 465, false for other ports
                auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_CREDENTIALS,
                },
            }
    }
};

const transporter = nodemailer.createTransport(config());


module.exports = { transporter };