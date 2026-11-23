import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const GetInstagramToken = () => (
  <PageLayout narrow back={{ to: '/dashboard', label: 'Retour au compteur' }}>
    <div className="page__head">
      <span className="eyebrow">Guide</span>
      <h1 style={{ marginTop: 14 }}>Connecter votre compte Instagram</h1>
      <p>
        Pour afficher vos abonnés en temps réel, Count-inst doit accéder à votre compte via l’API officielle de Meta.
        Suivez ces étapes, cela prend environ 5 minutes.
      </p>
    </div>

    <ol className="steps-list">
      <li>
        <h3>Passez en compte professionnel</h3>
        <p>
          Dans l’application Instagram : Profil → menu ☰ → <em>Paramètres et confidentialité</em> →
          <em> Type de compte et outils</em> → <em>Passer à un compte professionnel</em>. Choisissez « Créateur » ou « Entreprise ».
        </p>
      </li>
      <li>
        <h3>Reliez-le à une Page Facebook</h3>
        <p>
          L’API Meta nécessite que votre compte Instagram soit lié à une Page Facebook. Depuis Instagram :
          <em> Modifier le profil</em> → <em>Page</em> → associez ou créez une Page.
        </p>
      </li>
      <li>
        <h3>Connectez-vous avec Meta</h3>
        <p>
          Cliquez sur le bouton ci-dessous, connectez-vous à Facebook et acceptez les autorisations demandées.
          Nous n’accédons qu’à vos informations publiques et à votre nombre d’abonnés.
        </p>
        <Link to="/connect-instagram" className="btn btn--grad" style={{ marginTop: 14 }}>Connecter Instagram</Link>
      </li>
      <li>
        <h3>C’est prêt !</h3>
        <p>
          Votre compteur s’affiche automatiquement sur votre tableau de bord. Utilisateur avancé ? Vous pouvez aussi
          coller un token d’accès manuellement depuis votre <Link to="/profile">profil</Link>.
        </p>
      </li>
    </ol>

    <div className="alert alert--info" style={{ marginTop: 24 }}>
      Un problème lors de la connexion ? <Link to="/contact" style={{ marginLeft: 4 }}>Contactez-nous</Link>, nous vous aidons.
    </div>
  </PageLayout>
);

export default GetInstagramToken;
