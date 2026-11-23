import { useState } from 'react';
import axios from 'axios';
import PageLayout from '../components/PageLayout';

const Contact = () => {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, form);
      setStatus({ type: 'success', text: 'Message envoyé avec succès. Nous revenons vers vous rapidement.' });
      setForm({ firstname: '', lastname: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: "Erreur lors de l'envoi du message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout narrow>
      <div className="page__head center">
        <span className="eyebrow">Contact</span>
        <h1 style={{ marginTop: 14 }}>Une question ? Parlons-en.</h1>
        <p>Support, facturation, suggestion… Nous répondons en général sous 24 h.</p>
      </div>

      <div className="card card--elevated">
        <form onSubmit={handleSubmit} className="form">
          {status && <div className={`alert alert--${status.type}`} role="status">{status.text}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="field">
              <label className="field__label" htmlFor="firstname">Prénom</label>
              <input id="firstname" className="input" name="firstname" value={form.firstname} onChange={handleChange} required />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lastname">Nom</label>
              <input id="lastname" className="input" name="lastname" value={form.lastname} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@exemple.com" required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="message">Message</label>
            <textarea id="message" className="textarea" name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Comment pouvons-nous vous aider ?" required />
          </div>

          <div>
            <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
              {loading ? 'Envoi…' : 'Envoyer le message'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default Contact;
