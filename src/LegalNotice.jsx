import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const LegalNotice = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>

      <div>
      <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>
      <h1>Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        Nom de l’application : <strong>MonApplication</strong><br />
        Éditeur : <strong>Riyad Gouaich</strong><br />
        Contact : <a href="mailto:contact@monapplication.com">contact@monapplication.com</a><br />
        Adresse : [Votre adresse ou celle de votre entreprise]<br />
        Numéro SIRET (si entreprise) : [Votre numéro]
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par :<br />
        Nom de l’hébergeur : <strong>Vercel / OVH / autre</strong><br />
        Adresse de l’hébergeur : [adresse complète]<br />
        Téléphone : [facultatif]
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété de MonApplication,
        sauf mention contraire. Toute reproduction, représentation ou diffusion sans autorisation est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        L’éditeur décline toute responsabilité en cas de dysfonctionnement du site, d’erreurs ou d’inexactitudes dans
        le contenu, ou de dommages résultant de l’utilisation du site.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les données collectées via le site sont utilisées uniquement dans le cadre du service proposé. Pour plus
        d’informations, veuillez consulter notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou réclamation, veuillez contacter : <a href="mailto:contact@monapplication.com">contact@monapplication.com</a>
      </p>
    </div>
  );
};

export default LegalNotice;
