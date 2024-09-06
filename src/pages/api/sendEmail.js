import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, subject, message } = req.body;

    // Create a transporter using SMTP transport for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS  // Your Gmail password or App Password
      },
    });

    try {
      // Send the email
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: subject,
        text: message,
      });
      res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
}
