import { Link } from 'react-router-dom';


const Footer = () => (
  <footer style={{
    background: '#ff0000ff',
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #ddd',
    marginTop: '50px'
  }}>
    <p style={{ marginBottom: '10px' }}>© {new Date().getFullYear()} MonApplication</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <Link to="/mentions-legales">Mentions légales</Link>
      <Link to="/politique-confidentialite">Politique de confidentialité</Link>
      <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
      <Link to="/cookiesPolicy">Cookies</Link>
    </div>
  </footer>
);

export default Footer;
