import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const TermsAndConditions = () => {
  return (
    <div className="body-sim">

      <div>
      <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
              ← Retour au dashboard
            </button>
          </Link>
        </div>
      <h1>Conditions Générales d'Utilisation</h1>
      
      <p>Dernière mise à jour : 30 juillet 2025</p>

      <h2>1. Objet</h2>
      <p>Les présentes Conditions Générales d’Utilisation ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs peuvent accéder et utiliser notre application.</p>

      <h2>2. Acceptation</h2>
      <p>En accédant ou en utilisant notre application, vous acceptez les présentes CGU sans réserve.</p>

      <h2>3. Accès au service</h2>
      <p>L'accès à l'application est réservé aux utilisateurs disposant d'un compte. L’éditeur se réserve le droit de restreindre ou suspendre l’accès pour des raisons de maintenance ou de sécurité.</p>

      <h2>4. Compte utilisateur</h2>
      <p>L’utilisateur s’engage à fournir des informations exactes lors de la création de son compte. Il est responsable de la confidentialité de ses identifiants.</p>

      <h2>5. Propriété intellectuelle</h2>
      <p>Tous les éléments de l’application (textes, logos, graphismes, etc.) sont protégés par le droit de la propriété intellectuelle et sont la propriété exclusive de l’éditeur.</p>

      <h2>6. Responsabilités</h2>
      <p>L’éditeur ne peut être tenu responsable en cas de dommages indirects ou pertes de données liés à l’utilisation du service.</p>

      <h2>7. Modification des CGU</h2>
      <p>Les CGU peuvent être modifiées à tout moment. Les utilisateurs seront notifiés en cas de modification substantielle.</p>

      <h2>8. Loi applicable</h2>
      <p>Les présentes conditions sont régies par la loi française. En cas de litige, les tribunaux compétents seront ceux de Paris.</p>

      <p>Pour toute question : <a href="mailto:support@votresite.com">support@votresite.com</a></p>
    </div>
  );
};

export default TermsAndConditions;
