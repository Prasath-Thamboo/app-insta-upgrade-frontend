import React, { useState } from 'react';
import '../css/App.css';
import { Link } from 'react-router-dom';



const GetInstagramToken = () => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer le token à ton serveur ou le stocker dans l'application
    if (token) {
      console.log("Token Instagram : ", token);
      // Par exemple, appeler une API pour enregistrer le token
      // fetch('YOUR_BACKEND_URL', { method: 'POST', body: JSON.stringify({ token }) });
    } else {
      setErrorMessage("Veuillez entrer un token Instagram valide.");
    }
  };

  return (
    <div className="body-sim" style={{ padding: '50px'}}>

      <Link to="/dashboard">
            <button
              style={{
                backgroundColor: 'var(--main-color)',
                color: 'white',
                padding: '10px 20px',
                background: 'var(--bg)',
                fontWeight: 'bold',
                border: 'none',            
            }}
            >
              ← Retour au dashboard
            </button>
        </Link>

      <h1>Récupérer votre token Instagram</h1>

      <p>
        Pour connecter votre compte Instagram à notre application et suivre l’évolution de vos abonnés, vous devez obtenir un token d'accès Instagram. Suivez les étapes ci-dessous pour récupérer ce token et le connecter à votre compte.
      </p>

      <h2>Étape 1 : Créer une application Instagram</h2>
      <p>
        Rendez-vous sur le site des développeurs de Facebook (<a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook Developer</a>) et connectez-vous à votre compte Facebook (si ce n’est pas déjà fait).
        Ensuite, créez une nouvelle application en cliquant sur "Get Started" dans le tableau de bord. Suivez les instructions pour ajouter l'Instagram Graph API à votre application.
      </p>

      <h2>Étape 2 : Ajouter Instagram Graph API à votre application</h2>
      <p>
        Dans le tableau de bord de votre application, vous devrez activer l'API Instagram en cliquant sur "Add Product" et en sélectionnant "Instagram Graph API". Assurez-vous de remplir toutes les informations nécessaires.
      </p>

      <h2>Étape 3 : Générez un code d'autorisation OAuth</h2>
      <p>
        Visitez le lien ci-dessous pour autoriser notre application à accéder à votre compte Instagram. Cela vous redirigera vers une page où vous devrez accepter les permissions demandées pour que nous puissions accéder à vos informations publiques de compte Instagram.
      </p>
      <p>
        Cliquez sur le bouton ci-dessous pour commencer ce processus :
      </p>
      <a href="https://api.instagram.com/oauth/authorize/?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile,user_media&response_type=code" target="_blank" rel="noopener noreferrer">
        Autoriser l'accès à Instagram
      </a>

      <h2>Étape 4 : Ajouter le token dans votre profil</h2>
      <p>
        Une fois que vous avez obtenu votre token, collez-le dans votre profil dans la section Token. 
      </p>

      <p>
        Si vous avez des questions ou rencontrez des problèmes lors du processus, n'hésitez pas à nous contacter via notre page de support.
      </p>
    </div>
  );
};

export default GetInstagramToken;
