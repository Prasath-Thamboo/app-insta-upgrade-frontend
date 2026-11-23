import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';

/** Page publique standard : header du site + zone de contenu. */
export default function PageLayout({ children, narrow = false, back }) {
  return (
    <>
      <SiteHeader />
      <main className={`page ${narrow ? 'page--narrow' : ''}`}>
        <div className="container">
          {back && (
            <Link to={back.to} className="back-link">← {back.label}</Link>
          )}
          {children}
        </div>
      </main>
    </>
  );
}

/** Écran centré pour les états (succès, erreur, attente). */
export function StatusScreen({ icon, tone = 'brand', title, children, actions }) {
  return (
    <>
      <SiteHeader />
      <main className="page page--center">
        <div className="card card--elevated status-card">
          <div className={`status-card__icon status-card__icon--${tone}`}>{icon}</div>
          <h1>{title}</h1>
          {children}
          {actions && <div className="row">{actions}</div>}
        </div>
      </main>
    </>
  );
}
