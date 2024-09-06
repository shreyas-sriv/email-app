import { useState } from 'react';

export default function Home() {
  const [bcID, setBcID] = useState('');
  // const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('');

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const formData = new FormData();
    formData.append('bcID', bcID);

    // Append multiple images
    images.forEach((image) => {
      formData.append('images', image);
    });

    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (result) {
      setStatus(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style = {{display: 'flex', justifyContent: 'center'}}>
        <img  width = '150px' src = '/agratam.jpeg'></img>
      </div>
      <form onSubmit={sendEmail} encType="multipart/form-data" style={styles.form}>
        <input
          type="text"
          placeholder="Enter BC ID"
          value={bcID}
          onChange={(e) => setBcID(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
          capture="environment"
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
      <p style={styles.status}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: 'black',
    background: 'white'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: '100px',
  },
  fileInput: {
    margin: '16px 0',
    fontSize: '16px',
    color:'black'
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  status: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#555',
  },
};
