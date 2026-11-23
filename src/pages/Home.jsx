import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import '../css/Home.css';

const THEMES = [
  { id: 'classic', label: 'Classique', desc: 'Dégradé chaleureux, inspiré d’Instagram.' },
  { id: 'modern', label: 'Moderne', desc: 'Bleu électrique, net et dynamique.' },
  { id: 'minimal', label: 'Minimal', desc: 'Sobre, lisible, parfait pour les pros.' },
  { id: 'neon', label: 'Néon', desc: 'Effet lumineux pour les ambiances de nuit.' },
  { id: 'glass', label: 'Glass', desc: 'Verre dépoli et couleurs douces.' },
];

const FEATURES = [
  { icon: '⚡', title: 'Temps réel', text: 'Le compteur s’actualise toutes les 3 secondes. Chaque nouvel abonné s’affiche avec une animation.' },
  { icon: '🎨', title: '5 designs personnalisables', text: 'Classique, moderne, minimal, néon ou glass : un style pour chaque marque et chaque lieu.' },
  { icon: '🔔', title: 'Alertes gain / perte', text: 'Une notification animée signale instantanément chaque gain ou perte d’abonnés.' },
  { icon: '🖥️', title: 'Pensé pour les écrans', text: 'Affichage plein écran, lisible de loin, idéal pour vitrines, TV et événements.' },
  { icon: '🛡️', title: 'Sécurisé & RGPD', text: 'Connexion via l’API officielle Meta. Vos données ne sont jamais revendues.' },
  { icon: '👤', title: 'Espace personnel', text: 'Photo de profil, design, abonnement et compte : tout se gère depuis votre profil.' },
];

const STEPS = [
  { title: 'Créez votre compte', text: 'Inscription gratuite en moins d’une minute, confirmée par email.' },
  { title: 'Connectez Instagram', text: 'Reliez votre compte Instagram professionnel via la connexion sécurisée Meta.' },
  { title: 'Choisissez votre design', text: 'Sélectionnez le style qui colle à votre image depuis votre profil.' },
  { title: 'Affichez & partagez', text: 'Ouvrez votre compteur en plein écran sur n’importe quel écran. C’est en direct.' },
];

const USE_CASES = [
  { icon: '🛍️', title: 'Boutiques & vitrines', text: 'Montrez la communauté qui soutient votre marque, directement en magasin.' },
  { icon: '🎤', title: 'Événements & salons', text: 'Animez votre stand : les visiteurs s’abonnent et voient le compteur grimper.' },
  { icon: '📹', title: 'Créateurs & streamers', text: 'Affichez votre progression en live et célébrez chaque palier avec votre audience.' },
  { icon: '🏢', title: 'Agences & bureaux', text: 'Gardez les objectifs social media visibles par toute l’équipe, en continu.' },
];

const FAQ = [
  { q: 'Ai-je besoin d’un compte Instagram professionnel ?', a: 'Oui. L’API officielle de Meta ne donne accès au nombre d’abonnés que pour les comptes Professionnels (Créateur ou Entreprise). Le passage en compte pro est gratuit et se fait en quelques clics depuis l’application Instagram.' },
  { q: 'À quelle fréquence le compteur est-il mis à jour ?', a: 'Le compteur interroge Instagram toutes les 3 secondes. Dès que votre nombre d’abonnés change, les chiffres s’animent et une notification apparaît.' },
  { q: 'Comment fonctionne l’essai gratuit ?', a: 'Après inscription, activez l’essai depuis votre tableau de bord : vous profitez de toutes les fonctionnalités pendant 7 jours, sans carte bancaire.' },
  { q: 'Puis-je résilier à tout moment ?', a: 'Oui, l’abonnement Premium est sans engagement. Vous le gérez (résiliation, changement de carte) depuis votre profil via le portail sécurisé Stripe.' },
  { q: 'Mes données sont-elles en sécurité ?', a: 'La connexion passe exclusivement par l’API officielle Meta, les paiements par Stripe. Nous ne stockons jamais votre mot de passe Instagram et respectons le RGPD.' },
  { q: 'Sur quels écrans puis-je afficher le compteur ?', a: 'Partout où un navigateur web est disponible : ordinateur, TV connectée, tablette, écran dynamique de vitrine… Le design s’adapte à toutes les tailles.' },
];

/** Compteur de démonstration qui « gagne » des abonnés tout seul. */
function useDemoCounter(start = 12480) {
  const [count, setCount] = useState(start);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1 + Math.floor(Math.random() * 3));
      setBump((b) => b + 1);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  return [count, bump];
}

function DemoCounter({ theme, count, bump, compact = false }) {
  return (
    <div className={`demo demo--${theme} ${compact ? 'demo--compact' : ''}`}>
      <div className="demo__card">
        <div className="demo__avatar" aria-hidden="true">
          <img src="/insta-logo2.png" alt="" />
        </div>
        <div className="demo__digits" aria-label={`${count} abonnés`}>
          {count.toString().split('').map((d, i) => (
            <span key={`${i}-${d}-${bump}`} className="demo__digit">{d}</span>
          ))}
        </div>
      </div>
      <div className="demo__handle">Abonnez-vous <strong>@votre.marque</strong></div>
    </div>
  );
}

export default function Home() {
  const [count, bump] = useDemoCounter();
  const [theme, setTheme] = useState('classic');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (bump === 0) return;
    setToast(true);
    const id = setTimeout(() => setToast(false), 1600);
    return () => clearTimeout(id);
  }, [bump]);

  return (
    <div className="home">
      <SiteHeader />

      <main>
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <div className="container hero__grid">
            <div className="hero__copy">
              <span className="eyebrow"><span className="dot" /> Compteur Instagram en direct</span>
              <h1>
                Affichez vos abonnés Instagram <span className="text-grad">en temps réel</span>, partout.
              </h1>
              <p className="hero__lead">
                Count-inst transforme votre nombre d’abonnés en un compteur animé et élégant,
                à afficher sur vos écrans, vitrines, événements ou lives. Connectez votre compte,
                choisissez un design, c’est prêt.
              </p>
              <div className="hero__cta">
                <Link to="/register" className="btn btn--grad btn--lg">Essayer gratuitement 7 jours</Link>
                <a href="#designs" className="btn btn--lg">Voir les designs</a>
              </div>
              <ul className="hero__trust">
                <li>✓ Sans carte bancaire</li>
                <li>✓ API officielle Meta</li>
                <li>✓ Sans engagement</li>
              </ul>
            </div>

            <div className="hero__visual">
              <div className="device">
                <div className="device__bar"><span /><span /><span /><em>count-inst.app/dashboard</em></div>
                <DemoCounter theme="classic" count={count} bump={bump} />
              </div>
              {toast && <div className="hero__toast">🚀 Nouvel abonné !</div>}
              <div className="hero__chip hero__chip--a">
                <strong>+128</strong><span>cette semaine</span>
              </div>
              <div className="hero__chip hero__chip--b">
                <span className="live-dot" /> En direct
              </div>
            </div>
          </div>
        </section>

        {/* ============ BANDEAU CONFIANCE ============ */}
        <section className="strip" aria-label="Points clés">
          <div className="container strip__inner">
            <div><strong>3 s</strong><span>d’actualisation</span></div>
            <div><strong>5</strong><span>designs inclus</span></div>
            <div><strong>7 jours</strong><span>d’essai gratuit</span></div>
            <div><strong>100 %</strong><span>API officielle Meta</span></div>
          </div>
        </section>

        {/* ============ FONCTIONNALITÉS ============ */}
        <section id="fonctionnalites" className="section">
          <div className="container">
            <header className="section__head">
              <span className="eyebrow">Fonctionnalités</span>
              <h2>Tout ce qu’il faut pour mettre en valeur votre communauté</h2>
              <p>Un outil simple, pensé pour être installé en quelques minutes et oublié ensuite : il tourne tout seul.</p>
            </header>
            <div className="features">
              {FEATURES.map((f) => (
                <article className="feature" key={f.title}>
                  <span className="feature__icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DESIGNS ============ */}
        <section id="designs" className="section section--tinted">
          <div className="container">
            <header className="section__head">
              <span className="eyebrow">Designs</span>
              <h2>Un style pour chaque univers</h2>
              <p>Cliquez sur un thème pour le prévisualiser. Vous pourrez en changer à tout moment depuis votre profil.</p>
            </header>

            <div className="showcase">
              <div className="showcase__tabs" role="tablist" aria-label="Choisir un design">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={theme === t.id}
                    className="showcase__tab"
                    onClick={() => setTheme(t.id)}
                  >
                    <span className={`showcase__swatch swatch--${t.id}`} />
                    <span>
                      <strong>{t.label}</strong>
                      <small>{t.desc}</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="showcase__stage" role="tabpanel">
                <DemoCounter theme={theme} count={count} bump={bump} compact />
              </div>
            </div>
          </div>
        </section>

        {/* ============ COMMENT ÇA MARCHE ============ */}
        <section id="comment-ca-marche" className="section">
          <div className="container">
            <header className="section__head">
              <span className="eyebrow">Comment ça marche</span>
              <h2>En ligne en 4 étapes</h2>
              <p>Aucune compétence technique requise. Si vous savez ouvrir une page web, vous savez utiliser Count-inst.</p>
            </header>
            <ol className="timeline">
              {STEPS.map((s, i) => (
                <li key={s.title} className="timeline__item">
                  <span className="timeline__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ CAS D'USAGE ============ */}
        <section className="section section--dark">
          <div className="container">
            <header className="section__head">
              <span className="eyebrow eyebrow--dark">Pour qui ?</span>
              <h2>Conçu pour ceux qui font vivre leur communauté</h2>
            </header>
            <div className="usecases">
              {USE_CASES.map((u) => (
                <article className="usecase" key={u.title}>
                  <span className="usecase__icon">{u.icon}</span>
                  <h3>{u.title}</h3>
                  <p>{u.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TARIFS ============ */}
        <section id="tarifs" className="section section--tinted">
          <div className="container">
            <header className="section__head">
              <span className="eyebrow">Tarifs</span>
              <h2>Simple et transparent</h2>
              <p>Testez gratuitement, passez Premium quand vous êtes convaincu.</p>
            </header>
            <div className="pricing">
              <article className="plan">
                <h3>Essai gratuit</h3>
                <p>Pour découvrir le service.</p>
                <div className="plan__price">0 € <small>/ 7 jours</small></div>
                <ul>
                  <li>Compteur en temps réel</li>
                  <li>Les 5 designs</li>
                  <li>Alertes gain / perte</li>
                  <li>Sans carte bancaire</li>
                </ul>
                <Link to="/register" className="btn btn--block btn--lg">Commencer l’essai</Link>
              </article>
              <article className="plan plan--featured">
                <span className="plan__tag">Recommandé</span>
                <h3>Premium</h3>
                <p>Pour un affichage permanent.</p>
                <div className="plan__price">19,99 € <small>/ mois</small></div>
                <ul>
                  <li>Accès complet et illimité</li>
                  <li>Suivi automatique en continu</li>
                  <li>Alertes de variations</li>
                  <li>Assistance prioritaire</li>
                  <li>Résiliable à tout moment</li>
                </ul>
                <Link to="/register" className="btn btn--grad btn--block btn--lg">Passer à Premium</Link>
              </article>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" className="section">
          <div className="container faq">
            <header className="section__head section__head--left">
              <span className="eyebrow">FAQ</span>
              <h2>Questions fréquentes</h2>
              <p>Une autre question ? <Link to="/contact">Écrivez-nous</Link>, nous répondons rapidement.</p>
            </header>
            <div className="faq__list">
              {FAQ.map((f) => (
                <details key={f.q} className="faq__item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="section section--pad-sm">
          <div className="container">
            <div className="cta-final">
              <h2>Prêt à voir vos abonnés grimper en direct ?</h2>
              <p>Créez votre compte et affichez votre compteur dès aujourd’hui. 7 jours offerts, sans engagement.</p>
              <div className="hero__cta">
                <Link to="/register" className="btn btn--lg cta-final__btn">Créer mon compte gratuitement</Link>
                <Link to="/login" className="btn btn--lg btn--ghost cta-final__ghost">J’ai déjà un compte</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
