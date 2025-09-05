import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './App.css';


export default function Home({
  brandName = "Counter-Inst",
  primaryCtaHref = "/start-trial",
  secondaryCtaHref = "/subscribe",
}) {
  useEffect(() => {
    document.title = `Pourquoi un compteur ? | ${brandName}`;
  }, [brandName]);

  return (
    <main style={styles.wrap}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>Guide pratique</div>
        <h1 style={styles.h1}>Pourquoi utiliser un compteur en temps réel ?</h1>
        <p style={styles.lead}>
          Un compteur de followers en direct n’est pas un gadget. C’est un
          <strong> retour immédiat</strong> sur votre travail, un levier de
          <strong> motivation</strong>, et un outil pour <strong>tester</strong>
          , <strong>optimiser</strong> et <strong>raconter</strong> votre
          progression.
        </p>
        <div style={styles.ctaRow}>
          <Link to={primaryCtaHref} style={styles.ctaPrimary}>
            Démarrer l’essai 7 jours
          </Link>
          <Link to={secondaryCtaHref} style={styles.ctaSecondary}>
            Voir les offres
          </Link>
        </div>
        <p style={styles.subtle}>
          Pas de carte requise pendant l’essai. Annulable en un clic.
        </p>
      </section>

      {/* Benefits grid */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Ce que vous gagnez concrètement</h2>
        <div style={styles.grid}>          
          <Feature
            title="Motivation visuelle"
            desc="Voir le compteur bouger après un post, c’est le meilleur anti-procrastinateur. Vous créez plus, mieux et plus souvent."
            icon="🚀"
          />
          <Feature
            title="Mesure instantanée"
            desc="Plus besoin d’attendre des rapports hebdo. Test A/B en temps réel : heure de publication, format, légende, hashtag."
            icon="⏱️"
          />
          <Feature
            title="Storytelling"
            desc="Un chiffre vivant sur scène, en stream ou en story, c’est de l’émotion partagée et de l’engagement en plus."
            icon="🎥"
          />
          <Feature
            title="Objectifs clairs"
            desc="Fixez des jalons (1 000 → 5 000 → 10 000). Le compteur matérialise la distance à parcourir, jour après jour."
            icon="🎯"
          />
          <Feature
            title="Preuves sociales"
            desc="Capturez un palier en direct (ex : 10 000). Parfait pour les posts, pages presse, ou partenariats."
            icon="📈"
          />
          <Feature
            title="Focus produit"
            desc="Tout est centré sur une métrique qui compte vraiment : la communauté. Pas de dashboards dispersés."
            icon="🧭"
          />
        </div>
      </section>

      {/* How it works */}
      <section style={styles.section}>        
        <h2 style={styles.h2}>Comment ça marche ?</h2>
        <ol style={styles.steps}>
          <li>
            <strong>Connectez votre compte</strong> Instagram en 30 secondes.
          </li>
          <li>
            <strong>Affichez le compteur</strong> sur votre écran, scène ou
            stream.
          </li>
          <li>
            <strong>Publiez</strong>… et suivez l’impact en direct.
          </li>
        </ol>
        <p style={styles.note}>
          {brandName} ne demande que les autorisations strictement nécessaires.
          Vous pouvez <strong>déconnecter</strong> votre compte à tout moment.
        </p>
      </section>

      {/* Use-cases */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Exemples d’utilisation</h2>
        <div style={styles.cards}>
          <Card
            title="Créateurs & streamers"
            bullets={[
              "Animer un live avec des paliers (ex : +100, +500)",
              "Afficher l’objectif de la semaine",
              "Célébrer les milestones en direct",
            ]}
          />
          <Card
            title="Marques & événements"
            bullets={[
              "Mesurer l’impact d’un reveal/concours",
              "Affichage sur scène ou stand",
              "Contenu social en coulisses",
            ]}
          />
          <Card
            title="Classes & associations"
            bullets={[
              "Motiver une équipe autour d’un objectif",
              "Montrer la progression collective",
              "Créer des rendez‑vous hebdo",
            ]}
          />
        </div>
      </section>

      {/* Social proof / mini testimonials (placeholder) */}
      <section style={styles.section}>        
        <h2 style={styles.h2}>Ils utilisent déjà un compteur</h2>
        <ul style={styles.quotes}>
          <li>“On a doublé notre rythme de publication, parce qu’on voit l’effet immédiatement.”</li>
          <li>“Parfait en live : le chat participe dès qu’on approche d’un palier.”</li>
          <li>“On a calé nos horaires de post en 3 jours de tests.”</li>
        </ul>
      </section>

      {/* FAQ */}
      <section style={styles.section}>        
        <h2 style={styles.h2}>FAQ</h2>
        <details style={styles.details}>
          <summary>Est‑ce que ça marche sans être abonné ?</summary>
          <p>Oui, vous pouvez tester la version d’essai 7 jours sans carte.</p>
        </details>
        <details style={styles.details}>
          <summary>Le compteur est‑il précis ?</summary>
          <p>Nous interrogeons l’API officielle et gérons un rafraîchissement régulier pour rester au plus proche du temps réel.</p>
        </details>
        <details style={styles.details}>
          <summary>Je peux l’afficher sur OBS / en public ?</summary>
          <p>Oui, le compteur est pensé pour le partage (scène, stand, stream, écran). </p>
        </details>
      </section>

      {/* CTA final */}
      <section style={{...styles.section, ...styles.center}}>        
        <h2 style={styles.h2}>Prêt à essayer ?</h2>
        <p style={styles.leadSmall}>Installez votre premier compteur en moins de 2 minutes.</p>
        <div style={styles.ctaRow}>
          <Link to={primaryCtaHref} style={styles.ctaPrimary}>Essai 7 jours</Link>
          <Link to={secondaryCtaHref} style={styles.ctaSecondary}>Voir les offres</Link>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIcon} aria-hidden>{icon}</div>
      <h3 style={styles.h3}>{title}</h3>
      <p style={styles.p}>{desc}</p>
    </div>
  );
}

function Card({ title, bullets = [] }) {
  return (
    <article style={styles.card}>
      <h3 style={styles.h3}>{title}</h3>
      <ul style={styles.list}>
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </article>
  );
}

// ——— Inline styles using your existing color tokens ———
const styles = {
  wrap: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 20px 80px",
    color: "var(--simple-color2)",
  },
  hero: {
    textAlign: "center",
    padding: "24px 0 12px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.1)",
    fontSize: 12,
    marginBottom: 10,
  },
  h1: { fontSize: 36, lineHeight: 1.2, margin: "8px 0 10px" },
  h2: { fontSize: 26, margin: "0 0 12px" },
  h3: { fontSize: 18, margin: "8px 0" },
  lead: { maxWidth: 720, margin: "0 auto", opacity: 0.9 },
  leadSmall: { opacity: 0.9, marginTop: 4 },
  subtle: { opacity: 0.7, marginTop: 8, fontSize: 12 },
  ctaRow: { display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" },
  ctaPrimary: {
    backgroundColor: "var(--main-color)",
    color: "white",
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
  },
  ctaSecondary: {
    backgroundColor: "var(--bg)",
    color: "var(--simple-color)",
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  section: { marginTop: 36 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  feature: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    height: "100%",
  },
  featureIcon: { fontSize: 22, marginBottom: 8 },
  p: { opacity: 0.95 },
  steps: {
    maxWidth: 720,
    margin: "0 auto",
    lineHeight: 1.7,
  },
  note: { maxWidth: 720, margin: "8px auto 0", opacity: 0.8 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
  },
  list: {
    paddingLeft: 18,
    lineHeight: 1.7,
  },
  quotes: {
    maxWidth: 820,
    margin: "0 auto",
    display: "grid",
    gap: 10,
    listStyle: "none",
    padding: 0,
  },
  details: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  center: { textAlign: "center" },
};
