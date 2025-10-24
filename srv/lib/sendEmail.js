module.exports = sendEmail;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function sendEmail(textFilePath) {
    console.log('---Begin of Sending Email---');
    
    try {
        let nodemailer;
        try {
            nodemailer = require('nodemailer');
        } catch (error) {
            throw new Error('Nodemailer module not found. Please install it with: npm install nodemailer');
        }
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        
        await transporter.verify();
        console.log('SMTP connection verified successfully');
        
        const fileName = path.basename(textFilePath);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'Audit Log Retrieval - Success',
            html: `
                <html>
                    <body>
                        <h2>Audit Log Retrieval - Success</h2>
                        <p>The audit log retrieval has been completed successfully.</p>
                        <p>Please find the audit logs in the attached text file.</p>
                    </body>
                </html>
            `,
            attachments: [
                {
                    filename: fileName,
                    path: textFilePath
                }
            ]
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
        
        // Clean up the file after sending
        fs.unlinkSync(textFilePath);
        console.log(`Temporary file deleted: ${fileName}`);
        
        console.log('---End of Sending Email---');
        return [`Email sent successfully to ${process.env.EMAIL_TO}`, `Message ID: ${info.messageId}`];
    } catch (error) {
        console.log(`Error during email sending: ${error.message}`);
        
        // Clean up file even if email fails
        try {
            if (fs.existsSync(textFilePath)) {
                fs.unlinkSync(textFilePath);
            }
        } catch (cleanupError) {
            console.log(`Error during file cleanup: ${cleanupError.message}`);
        }
        
        throw error;
    }
}