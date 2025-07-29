import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Contact = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/contact', form);
      setStatus('Message envoyé avec succès.');
      setForm({ firstname: '', lastname: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div style={{ padding: "40px", margin: "auto", background:'var(--bg)' }}>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/dashboard">
          <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px' }}>
            ← Retour au dashboard
          </button>
        </Link>
      </div>
      <h2 style={{textAlign:'center'}}>Contactez l’administrateur</h2>
      <form onSubmit={handleSubmit} style={{display:'flex', gap:'20px'}}>
        <input type="text" name="firstname" placeholder="Prénom" value={form.firstname} onChange={handleChange} required />
        <input type="text" name="lastname" placeholder="Nom" value={form.lastname} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Votre email" value={form.email} onChange={handleChange} required />
        <textarea 
          name="message" 
          placeholder="Votre message" 
          value={form.message} 
          onChange={handleChange} required 
          style={{width:'1000px', height:'100px'}}
        />
        <button type="submit">Envoyer</button>
      </form>
      {status && <p style={{ marginTop: "15px" }}>{status}</p>}
    </div>
  );
};

export default Contact;
