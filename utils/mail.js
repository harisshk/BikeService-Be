const PropTypes = require("prop-types");
const nodemailer = require("nodemailer");

const { 
    EMAIL,
    PASS,
    SERVICE_PROVIDER,
    FROM
} = process.env;


/**
 * Send Mail to one user email
 * @param {String} to receiver email 
 * @param {String} subject subject of the email
 * @param {String} htmlBody body of the mail in HTML
 * @returns {Promise}
 */
const sendMailToOne = async (to, subject, htmlBody) => {
    
    try{

        const transporter = nodemailer.createTransport({
            service: SERVICE_PROVIDER,
            auth: {
                user: EMAIL,
                pass: PASS,
            },
            from : {
                name: EMAIL,
                address: EMAIL
              }
        });
        const mailOptions = {
            from: FROM,
            to,
            subject,
            html: htmlBody,
        };
    
        return await transporter.sendMail(mailOptions);
    
    }catch(error){
        console.log("---------------------ERROR IN SENDING MAIL----------------------------");
        console.log(error);
        return error;
    }
    
}

sendMailToOne.prototype = {
    to: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    htmlBody: PropTypes.string.isRequired
}

module.exports = {
    sendMailToOne
}