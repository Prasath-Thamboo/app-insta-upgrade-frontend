import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const CookiesPolicy = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
      <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>
      <h1>Politique d'utilisation des cookies</h1>
      
      <p>Dernière mise à jour : 30 juillet 2025</p>

      <h2>1. Qu’est-ce qu’un cookie ?</h2>
      <p>Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site ou utilisez une application. Il permet notamment de vous reconnaître d’une visite à l’autre et d’améliorer votre expérience utilisateur.</p>

      <h2>2. Cookies utilisés</h2>
      <p>Nous utilisons les types de cookies suivants :</p>
      <ul>
        <li><strong>Cookies nécessaires</strong> : indispensables au bon fonctionnement de l’application.</li>
        <li><strong>Cookies de mesure d’audience</strong> : pour analyser l’utilisation de notre application (ex : Google Analytics).</li>
        <li><strong>Cookies de réseaux sociaux</strong> : pour permettre le partage de contenu (ex : Instagram/Facebook).</li>
      </ul>

      <h2>3. Consentement</h2>
      <p>Lors de votre première visite, un bandeau de consentement vous permet d’accepter ou de refuser les cookies non essentiels. Vous pouvez modifier vos préférences à tout moment depuis la page "Gestion des cookies".</p>

      <h2>4. Durée de conservation</h2>
      <p>Les cookies sont conservés pour une durée maximale de 13 mois à compter de leur dépôt sur votre appareil.</p>

      <h2>5. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression ou de limitation du traitement de vos données collectées via les cookies.</p>

      <p>Pour toute question relative à cette politique, contactez-nous à : <a href="mailto:support@votresite.com">support@votresite.com</a></p>
    </div>
  );
};

export default CookiesPolicy;
