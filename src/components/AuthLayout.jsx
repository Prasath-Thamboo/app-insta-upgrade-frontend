import { Link } from 'react-router-dom';
import { Brand } from './SiteHeader';

/**
 * Mise en page partagée des écrans d'authentification :
 * panneau de présentation à gauche, formulaire à droite.
 */
export default function AuthLayout({ children, topRight }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Brand />
        <div>
          <h2>Vos followers Instagram, en direct et en grand.</h2>
          <p>
            Un compteur élégant, mis à jour en temps réel, à afficher sur vos écrans,
            vitrines et événements.
          </p>
          <ul className="auth__perks">
            <li><span>⚡</span> Actualisation toutes les 3 secondes</li>
            <li><span>🎨</span> 5 designs prêts à l’emploi</li>
            <li><span>🔒</span> API officielle Meta & conforme RGPD</li>
          </ul>
        </div>
        <p className="auth__quote">© {new Date().getFullYear()} Count-inst — Tous droits réservés</p>
      </aside>

      <main className="auth__main">
        <div className="auth__top">
          <Brand />
          <div>{topRight ?? <Link to="/">← Retour à l’accueil</Link>}</div>
        </div>
        <div className="auth__form-wrap">
          <div className="auth__form">{children}</div>
        </div>
        <p className="auth__foot">
          <Link to="/conditions-utilisation">Conditions</Link> · <Link to="/politique-confidentialite">Confidentialité</Link>
        </p>
      </main>
    </div>
  );
}
