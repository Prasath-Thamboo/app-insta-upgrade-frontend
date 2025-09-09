import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ConnectInstagram() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleConnect = () => {
    try {
      setErr('');
      setLoading(true);

      const CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;

      // 1) Vérif env vars
      if (!CLIENT_ID || !REDIRECT_URI) {
        setLoading(false);
        setErr(
          "Variables d'environnement manquantes : VITE_INSTAGRAM_CLIENT_ID et/ou VITE_INSTAGRAM_REDIRECT_URI."
        );
        console.error('ENV manquantes', { CLIENT_ID, REDIRECT_URI });
        return;
      }

      // 2) Génère un state anti-CSRF
      const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
      localStorage.setItem('ig_oauth_state', state);

      // 3) Construit l’URL OAuth Facebook (v19)
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI, // doit matcher EXACTEMENT la valeur whitelistée dans Facebook
        scope: 'pages_show_list,instagram_basic,instagram_manage_insights',
        response_type: 'code',
        state,
      });

      const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
      console.log('[IG OAuth] Redirect =>', authUrl);

      // 4) Redirection
      window.location.assign(authUrl);
    } catch (e) {
      setLoading(false);
      setErr('Erreur inattendue au moment de la redirection OAuth.');
      console.error(e);
    }
  };

  return (
    <div className="body-sim">
      <div className="container" style={{ maxWidth: 480 }}>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>

        <div style={{ background: 'white', borderRadius: 15, padding: 32, marginTop: 16 }}>
          <img src="/insta-logo.png" alt="Instagram" style={{ width: 80, marginBottom: 16 }} />
          <h2 style={{ color: 'var(--simple-color)' }}>Connexion Instagram</h2>
          <p style={{ marginBottom: 24, color: '#555' }}>
            Connectez votre compte Instagram Business/Creator. Aucune copie de token manuelle nécessaire.
          </p>

          {!!err && (
            <div style={{ color: 'red', marginBottom: 12, fontWeight: 600 }}>
              {err}
            </div>
          )}

          <button
            type="button"
            onClick={handleConnect}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--main-color)',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Redirection…' : 'Se connecter à Instagram'}
          </button>

          <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
            Besoin d’aide ? Ouvre la console du navigateur pour voir l’URL OAuth et vérifier les variables.
          </div>
        </div>
      </div>
    </div>
  );
}
