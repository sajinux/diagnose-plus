const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send an email notification when a new partner application is submitted
 * @param {Object} applicationData - Data from the application form
 */
exports.sendPartnerApplicationEmail = async (applicationData) => {
    try {
        const { email, full_name, business_name, phone, district, city, address } = applicationData;

        const mailOptions = {
            from: `"Diagnose Plus System" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: process.env.NOTIFICATION_EMAIL || 'sajiupe@gmail.com',
            subject: `New Partner Application: ${business_name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Partner Application Received</h2>
                    
                    <p>A new application has been submitted through the "Become a Partner" form.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 40%;">Business Name:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${business_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Owner/Manager:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${full_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Email:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">District:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${district}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">City:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${city}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Address:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${address}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 5px; font-size: 14px; color: #64748b;">
                        <p style="margin: 0;">This is an automated notification from the Diagnose Plus Backend.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Notification email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending notification email:', error);
        return { success: false, error: error.message };
    }
};
