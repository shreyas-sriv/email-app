import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, subject, message }),
    });

    const result = await res.json();
    if (result.success) {
      setStatus('Email sent successfully!');
    } else {
      setStatus('Failed to send email.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Send Email</h1>
      <form onSubmit={sendEmail}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
