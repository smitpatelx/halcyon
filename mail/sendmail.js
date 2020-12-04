let {transporter} = require('./drivers');

let sendmail = async (toVal, subjectVal, textVal, htmlVal) => {
    return new Promise((resolve,reject)=>{
        if (typeof htmlVal === undefined) {
            htmlVal = "";
        }
        // Sending new mail
        let fromVal = `'"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>'`
        transporter.sendMail({
            from: fromVal,
            to: toVal,
            subject: subjectVal,
            text: textVal,
            html: htmlVal,
        }, (error, info)=>{
            if(error) {
                reject(error)
            } else {
                if (typeof info.rejected !== 'undefined' && info.rejected.length > 0) {
                    resolve({ error_message: "Recipient addresses that were rejected by the server", rejectedData: info.rejected})
                } else if (typeof info.accepted !== 'undefined' && info.accepted.length > 0) {
                    resolve({ response: info.response, messageId: info.messageId, envelope: info.envelope , accepted: info.accepted })
                } else {
                    resolve("Unexpected error at /mail/sendmail.js - sendMail callback - error false")
                }
            }
        });
    });
}

module.exports = { sendmail }