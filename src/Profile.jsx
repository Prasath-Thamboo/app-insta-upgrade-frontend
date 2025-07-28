// Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [style, setStyle] = useState('classic');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get('http://localhost:3001/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setNewUsername(res.data.username);
        setProfilePicture(res.data.profilePicture);
        setStyle(res.data.dashboardStyle || 'classic');

      } catch (err) {
        console.error(err);
      }
    }
    fetchUserData();
  }, [token]);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3001/api/update-username',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername(newUsername);
      setMessage("Nom d'utilisateur mis à jour.");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du nom d'utilisateur");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3001/api/update-password',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword('');
      setMessage('Mot de passe mis à jour.');
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du mot de passe");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3001/api/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression du compte");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Veuillez sélectionner une image.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3001/api/upload-profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePicture(res.data.url);
      setMessage('Photo de profil mise à jour.');
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload de l'image.");
    }
  };

  const updateStyle = async () => {
  try {
    await axios.put('http://localhost:3001/api/update-style', {
      dashboardStyle: style,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage('Style mis à jour.');
  } catch (err) {
    setMessage('Erreur lors de la mise à jour du style');
  }
};


  return (
    <div className="body-sim" style={{ height:'100%', padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{maxWidth: '600px', width: '100%', background: 'tomato', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link to="/dashboard">
            <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Profil utilisateur</h2>
          {profilePicture && <img src={profilePicture} alt="Profil" style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }} />}
          <p style={{ color: '#555' }}>Connecté en tant que <strong>{username}</strong></p>
        </div>

        <form onSubmit={handleUsernameChange} style={{ marginBottom: '20px' }}>
          <label>Nom d’utilisateur</label>
          <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none', backgroundColor:'lightgrey'  }} />
          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Modifier</button>
        </form>

        <form onSubmit={handlePasswordChange} style={{ marginBottom: '20px' }}>
          <label>Nouveau mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none', backgroundColor:'lightgrey' }} />
          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Changer le mot de passe</button>
        </form>

        <form onSubmit={handleImageUpload} style={{ marginBottom: '20px' }}>
          <label>Photo de profil</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ width: '100%', marginTop: '5px' }} />
          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Uploader</button>
        </form>
        
        <div style={{ marginTop: '30px' }}>
  <h3>Choisir le design du dashboard :</h3>
  <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }}>
    <option value="classic">Classique</option>
    <option value="modern">Moderne</option>
    <option value="minimal">Minimal</option>
    <option value="neon">Neon</option>
    <option value="glass">Glassmorphism</option>
  </select>
  <button onClick={updateStyle} style={{ marginLeft: '10px', padding: '8px 16px' }}>Enregistrer</button>
</div>


        <button onClick={() => setShowConfirm(true)} style={{ width: '100%', backgroundColor: 'red', color: 'white', marginTop: '20px' }}>Supprimer mon compte</button>

        {showConfirm && (
          <div style={{ marginTop: '20px', backgroundColor: 'grey', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
            <p><strong>⚠️ Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?</strong></p>
            <button onClick={handleDeleteAccount} style={{ margin: '5px', backgroundColor: 'red', color: 'white' }}>Oui, supprimer</button>
            <button onClick={() => setShowConfirm(false)} style={{ margin: '5px' }}>Annuler</button>
          </div>
        )}

        {message && <p style={{ marginTop: '20px', color: 'green', textAlign: 'center' }}>{message}</p>}

        
      </div>
    </div>
  );
}
