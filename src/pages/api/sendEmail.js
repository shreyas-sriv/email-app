import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = new IncomingForm({
        multiples: true,
        uploadDir: './uploads',
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          return res.status(500).json({ message: 'Form parsing error' });
        }

        // Log fields and files for debugging
        console.log('Fields:', fields);
        console.log('Files:', files);

        // Handle attachments
        const attachments = [];
        if (files.images) {
          const fileArray = Array.isArray(files.images) ? files.images : [files.images];
          fileArray.forEach((file, index) => {
            if (file.filepath) {
              attachments.push({
                filename:`image_${index}.jpg`,
                path: file.filepath,
                encoding: 'base64', // Ensure correct encoding
              });
            }
          });
        }

        // Log attachments for debugging
        console.log('Attachments:', attachments);

        // Create transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        // Mail options
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.RECIPIENT_EMAIL,
          subject: 'New Email with Attachments',
          text: `BC ID: ${fields?.bcID[0] || 'N/A'}`,
          attachments,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Clean up uploaded files
        if (files.images) {
          const fileArray = Array.isArray(files.images) ? files.images : [files.images];
          fileArray.forEach(file => {
            fs.unlink(file.filepath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error removing file:', unlinkErr);
              }
            });
          });
        }

        res.status(200).json({ message: 'Email sent successfully' });
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
