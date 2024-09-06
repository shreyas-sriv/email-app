import { IncomingForm } from 'formidable';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

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
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          return res.status(500).json({ message: 'Form parsing error' });
        }

        // Extract the location coordinates from fields
        const { latitude, longitude } = fields;
        const locationName = await getLocationName(latitude[0], longitude[0]);

        // Handle attachments
        const attachments = [];
        if (files.images) {
          const fileArray = Array.isArray(files.images) ? files.images : [files.images];
          fileArray.forEach(file => {
            if (file.filepath) {
              const extension = path.extname(file.filepath);
              const filename = `${locationName}_${fields.bcID[0] || 'unknown'}.jpg`;
              attachments.push({
                filename,
                path: file.filepath,
              });
            }
          });
        }

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
          text: `BC ID: ${fields.bcID[0] || 'N/A'}`,
          attachments,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Clean up uploaded files
        if (files.images) {
          const fileArray = Array.isArray(files.images) ? files.images : [files.images];
          fileArray.forEach(file => {
            fs.unlinkSync(file.filepath);
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

// Function to get location name from coordinates
async function getLocationName(latitude, longitude) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json
`);
  
  if (!response.ok) {
    throw new Error('Error fetching location name');
  }

  const data = await response.json();
  return data.address.city || 'unknown_location'; // Return city name or default to 'unknown_location'
}
