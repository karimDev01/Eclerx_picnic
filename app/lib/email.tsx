import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

export async function sendConfirmationEmail(
  userEmail: string,
  userName: string,
  picnicTitle: string,
  picnicDate: string
) {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: `Picnic Registration Confirmation: ${picnicTitle}`,
      html: `
        <h2>Registration Confirmed!</h2>
        <p>Hi ${userName},</p>
        <p>Your registration for <strong>${picnicTitle}</strong> has been confirmed.</p>
        <p><strong>Date:</strong> ${picnicDate}</p>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>Picnic Management Team</p>
      `,
    });
  } catch (error) {
    console.error('Error sending user email:', error);
  }
}

export async function sendAdminNotification(
  picnicTitle: string,
  userName: string,
  userEmail: string,
  userPhone: string,
  picnicDate: string
) {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Registration: ${picnicTitle}`,
      html: `
        <h2>New Picnic Registration</h2>
        <p><strong>Picnic:</strong> ${picnicTitle}</p>
        <p><strong>Date:</strong> ${picnicDate}</p>
        <p><strong>Participant:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Phone:</strong> ${userPhone}</p>
        <p>Log in to your admin panel to view payment details.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
}
