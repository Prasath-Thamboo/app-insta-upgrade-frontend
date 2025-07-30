import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>

      <div>
      <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>
      <h1>Politique de Confidentialité</h1>
      <p>Dernière mise à jour : 30 juillet 2025</p>

      <h2>1. Introduction</h2>
      <p>
        Nous respectons votre vie privée et nous engageons à protéger les données à caractère personnel que vous partagez avec nous. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les données suivantes :</p>
      <ul>
        <li>Nom, prénom, adresse e-mail lors de l'inscription</li>
        <li>Données de connexion (adresse IP, navigateur)</li>
        <li>Données Instagram si vous connectez votre compte</li>
        <li>Données de paiement via Stripe (de manière sécurisée)</li>
      </ul>

      <h2>3. Utilisation des données</h2>
      <p>Vos données sont utilisées pour :</p>
      <ul>
        <li>Fournir l'accès à nos services</li>
        <li>Gérer vos abonnements</li>
        <li>Afficher vos statistiques Instagram</li>
        <li>Envoyer des notifications importantes</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        Nous utilisons des cookies pour améliorer l'expérience utilisateur. Vous pouvez les contrôler via les paramètres de votre navigateur. Voir notre <a href="/politique-cookies">politique de cookies</a> pour plus de détails.
      </p>

      <h2>5. Google Analytics</h2>
      <p>
        Nous utilisons Google Analytics pour analyser l'utilisation du site. Google peut collecter des données anonymes (IP, pages vues) conformément à sa propre politique de confidentialité.
      </p>

      <h2>6. Partage des données</h2>
      <p>
        Nous ne partageons vos données qu'avec nos partenaires nécessaires (Stripe, Meta) et dans le cadre légal requis.
      </p>

      <h2>7. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, portabilité, opposition.
      </p>

      <h2>8. Contact</h2>
      <p>
        Pour toute question ou demande relative à vos données personnelles, contactez-nous via <a href="/contact">notre formulaire de contact</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
