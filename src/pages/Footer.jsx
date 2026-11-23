import { Link, useLocation } from 'react-router-dom';
import { Brand } from '../components/SiteHeader';

// Pages en plein écran qui n'affichent pas le footer
const HIDDEN_ON = ['/dashboard', '/login', '/register'];

const Footer = () => {
  const { pathname } = useLocation();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <Brand />
            <p>Le compteur d’abonnés Instagram en temps réel, à afficher sur tous vos écrans.</p>
          </div>
          <div>
            <h4>Produit</h4>
            <ul>
              <li><a href="/#fonctionnalites">Fonctionnalités</a></li>
              <li><a href="/#designs">Designs</a></li>
              <li><a href="/#tarifs">Tarifs</a></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Compte</h4>
            <ul>
              <li><Link to="/register">Créer un compte</Link></li>
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/dashboard">Mon compteur</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Légal</h4>
            <ul>
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/politique-confidentialite">Confidentialité</Link></li>
              <li><Link to="/conditions-utilisation">Conditions d’utilisation</Link></li>
              <li><Link to="/cookiesPolicy">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Count-inst. Tous droits réservés.</span>
          <span>Fait avec ♥ en France</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
