import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusScreen } from '../components/PageLayout';

export default function ConnectInstagram() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleConnect = () => {
    try {
      setErr('');
      setLoading(true);

      const CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;

      if (!CLIENT_ID || !REDIRECT_URI) {
        setLoading(false);
        setErr("Variables d'environnement manquantes : VITE_INSTAGRAM_CLIENT_ID et/ou VITE_INSTAGRAM_REDIRECT_URI.");
        console.error('ENV manquantes', { CLIENT_ID, REDIRECT_URI });
        return;
      }

      // State anti-CSRF
      const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
      localStorage.setItem('ig_oauth_state', state);

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI, // doit matcher EXACTEMENT la valeur whitelistée dans Facebook
        scope: 'pages_show_list,instagram_basic,instagram_manage_insights',
        response_type: 'code',
        state,
      });

      window.location.assign(`https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`);
    } catch (e) {
      setLoading(false);
      setErr('Erreur inattendue au moment de la redirection OAuth.');
      console.error(e);
    }
  };

  return (
    <StatusScreen
      icon={<img src="/insta-logo.png" alt="" style={{ width: 40, height: 40 }} />}
      tone="brand"
      title="Connectez Instagram"
      actions={
        <>
          <button type="button" className="btn btn--grad btn--lg" onClick={handleConnect} disabled={loading}>
            {loading ? 'Redirection…' : 'Se connecter avec Meta'}
          </button>
          <Link to="/dashboard" className="btn btn--lg btn--ghost">Plus tard</Link>
        </>
      }
    >
      <p>
        Reliez votre compte Instagram <strong>professionnel</strong> (Créateur ou Entreprise) via la connexion
        officielle Meta. Aucun mot de passe Instagram n’est partagé avec nous.
      </p>
      {err && <div className="alert alert--error" role="alert">{err}</div>}
      <p className="muted" style={{ fontSize: '.85rem', marginTop: 16 }}>
        Compte personnel ? <Link to="/get-instagram-token">Voir comment passer en compte pro</Link>
      </p>
    </StatusScreen>
  );
}
