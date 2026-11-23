import { Link } from 'react-router-dom';
import { StatusScreen } from '../components/PageLayout';

const PaymentCancelled = () => (
  <StatusScreen
    icon="✕"
    tone="error"
    title="Paiement annulé"
    actions={
      <>
        <Link to="/subscribe" className="btn btn--primary btn--lg">Réessayer</Link>
        <Link to="/dashboard" className="btn btn--lg">Retour au compteur</Link>
      </>
    }
  >
    <p>Vous avez annulé le paiement. Aucun montant n’a été débité.</p>
  </StatusScreen>
);

export default PaymentCancelled;
