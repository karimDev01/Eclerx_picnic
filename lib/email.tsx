import nodemailer from 'nodemailer';

// Create transporter with Gmail or other email service
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });
};

export async function sendApprovalEmail(
  userEmail: string,
  picnicTitle: string,
  userName: string,
  picnicDate?: string
) {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Approved!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Great news! Your registration for <strong>${picnicTitle}</strong> has been approved.</p>
              ${picnicDate ? `<p><strong>Event Date:</strong> ${picnicDate}</p>` : ''}
              <p>Get ready for an amazing experience with our team!</p>
              <p>If you have any questions, feel free to reach out to us.</p>
              <p>Best regards,<br>Picnic Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: `Your Registration for ${picnicTitle} - APPROVED!`,
      html: htmlContent,
    });

    console.log(`[EMAIL] Approval email sent to ${userEmail}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send approval email:', error);
    // Don't throw - we don't want email errors to block registration
  }
}

export async function sendRejectionEmail(
  userEmail: string,
  picnicTitle: string,
  userName: string,
  reason: string
) {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Status Update</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for your interest in <strong>${picnicTitle}</strong>. We have reviewed your registration and regret to inform you that it has not been approved at this time.</p>
              <div class="reason-box">
                <strong>Reason:</strong><br>
                ${reason}
              </div>
              <p>We encourage you to check out other picnic events that might interest you. Feel free to apply for future events!</p>
              <p>If you have any questions, please contact us.</p>
              <p>Best regards,<br>Picnic Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: `Your Registration for ${picnicTitle} - Not Approved`,
      html: htmlContent,
    });

    console.log(`[EMAIL] Rejection email sent to ${userEmail}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send rejection email:', error);
  }
}

export async function sendAdminNotificationEmail(
  picnicTitle: string,
  userName: string,
  userEmail: string,
  phone: string
) {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Registration Received</h1>
            </div>
            <div class="content">
              <p>A new registration has been submitted for your picnic event.</p>
              <div class="info-box">
                <strong>Event:</strong> ${picnicTitle}
              </div>
              <div class="info-box">
                <strong>Name:</strong> ${userName}
              </div>
              <div class="info-box">
                <strong>Email:</strong> ${userEmail}
              </div>
              <div class="info-box">
                <strong>Phone:</strong> ${phone}
              </div>
              <p>Please log in to your admin dashboard to review and approve/reject this registration.</p>
              <p>Status: <strong>PENDING APPROVAL</strong></p>
              <p>Best regards,<br>Picnic Hub System</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Registration: ${picnicTitle} - ${userName}`,
      html: htmlContent,
    });

    console.log(`[EMAIL] Admin notification sent`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send admin notification:', error);
  }
}

export async function sendConfirmationEmail(
  userEmail: string,
  userName: string,
  picnicTitle: string
) {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .header { background: #8b5cf6; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .status-box { background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Submitted Successfully!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for registering for <strong>${picnicTitle}</strong>!</p>
              <div class="status-box">
                <strong>Current Status:</strong> PENDING APPROVAL
                <p>Your application is now under review. The admin will review your registration and send you an approval or rejection email within 24 hours.</p>
              </div>
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Admin reviews your registration</li>
                <li>You receive approval or rejection email</li>
                <li>If approved, follow the payment instructions</li>
              </ul>
              <p>We'll keep you updated. Thank you for choosing Picnic Hub!</p>
              <p>Best regards,<br>Picnic Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: `Registration Received: ${picnicTitle}`,
      html: htmlContent,
    });

    console.log(`[EMAIL] Confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send confirmation email:', error);
  }
}
