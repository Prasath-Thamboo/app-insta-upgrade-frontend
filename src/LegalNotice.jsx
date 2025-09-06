import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const LegalNotice = () => {
  return (
    <div className='body-sim'>

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
        Nom de l’application : <strong>Counter-Inst</strong><br />
        Éditeur : <strong>Prasath</strong><br />
        Contact : <a href="mailto:prasath1@hotmail.fr">prasath1@hotmail.fr</a><br />
        Adresse : 11 Rue Claude Monet, Paris, France<br />
        Numéro SIRET  : 833 455 6544
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par :<br />
        Nom de l’hébergeur : <strong>Netlify</strong><br />
        Adresse de l’hébergeur : 610 22nd Street, Suite 315 CA 94107 San Francisco<br />
        Téléphone : +1 844-899-7312
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété de Counter-Inst,
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
        d’informations, veuillez consulter notre <a href="/confidentialite">Politique de confidentialité</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou réclamation, veuillez contacter : <a href="mailto:prasath1@hotmail.fr">prasath1@hotmail.fr</a>
      </p>
    </div>
  );
};

export default LegalNotice;
