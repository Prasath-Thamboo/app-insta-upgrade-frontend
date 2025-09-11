import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/App.css';


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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, form);
      setStatus('Message envoyé avec succès.');
      setForm({ firstname: '', lastname: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div className='body-sim'>
       <div className="contact-container">
          <div className="return-button-wrapper">
            <Link to="/dashboard">
              <button className="back-button">← Retour au dashboard</button>
            </Link>
          </div>
          
          <h1 className="contact-title">Contactez l’administrateur</h1>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <fieldset className="form-fields">
              <input 
                type="text" 
                name="firstname" 
                placeholder="Prénom" 
                value={form.firstname} 
                onChange={handleChange} 
                required 
                aria-label="Prénom"
              />
              <input 
                type="text" 
                name="lastname" 
                placeholder="Nom" 
                value={form.lastname} 
                onChange={handleChange} 
                required 
                aria-label="Nom"
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Votre email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                aria-label="Email"
              />
              <textarea 
                name="message" 
                placeholder="Votre message" 
                value={form.message} 
                onChange={handleChange} 
                required 
                aria-label="Message"
                rows={5}
              />
            </fieldset>
            <button type="submit" className="submit-button">Envoyer</button>
          </form>

          {status && <p className="form-status">{status}</p>}
        </div>
      </div>
  );
};

export default Contact;
