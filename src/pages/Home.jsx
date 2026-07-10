import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Home.css';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Temps réel',
    text: 'Le compteur de followers se met à jour en direct, avec une popup animée à chaque gain ou perte.',
  },
  {
    icon: '🎛️',
    title: 'Designs multiples',
    text: 'Classique, moderne, minimal, néon ou glass : choisissez le style qui correspond à votre marque.',
  },
  {
    icon: '🛡️',
    title: 'Sécurisé & RGPD',
    text: 'Connexion via l’API officielle Instagram et respect total de la vie privée de vos données.',
  },
  {
    icon: '📊',
    title: 'Espace personnel',
    text: 'Retrouvez votre compteur, votre profil et vos statistiques depuis un tableau de bord dédié.',
  },
];

const STEPS = [
  {
    number: '1',
    title: 'Créez votre compte',
    text: 'Inscrivez-vous gratuitement en quelques secondes.',
  },
  {
    number: '2',
    title: 'Connectez Instagram',
    text: 'Reliez votre compte Instagram en toute sécurité via l’API officielle.',
  },
  {
    number: '3',
    title: 'Affichez votre compteur',
    text: 'Personnalisez le design et partagez votre compteur en temps réel.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-header">
        <Link to="/" className="brand home-brand">
          <img src="/insta-logo.png" alt="Logo Count-inst" className="brand-logo" />
          <span className="brand-name">Count-inst</span>
        </Link>

        <nav className="home-nav">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#comment-ca-marche">Comment ça marche</a>
          <Link to="/contact">Contact</Link>
        </nav>

        <button
          type="button"
          className="btn-primary home-header-cta"
          onClick={() => navigate('/login')}
        >
          Connexion / Inscription
        </button>
      </header>

      <main>
        <section className="home-hero">
          <h1 className="hero-title">Le compteur de followers Instagram en temps réel</h1>
          <p className="hero-subtitle">
            Suivez l’évolution de vos abonnés Instagram en direct, affichez un compteur stylé
            sur vos vitrines ou dashboards, et gardez un œil sur votre croissance sans effort.
          </p>

          <div className="cta-row">
            <button type="button" className="btn btn-fill" onClick={() => navigate('/register')}>
              Créer mon compte gratuitement
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/login')}>
              Se connecter
            </button>
          </div>
        </section>

        <section id="fonctionnalites" className="home-features">
          <h2>Pourquoi choisir Count-inst ?</h2>
          <div className="home-features-grid">
            {FEATURES.map((f) => (
              <div className="home-feature-card" key={f.title}>
                <span className="feat-ico">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="comment-ca-marche" className="home-steps">
          <h2>Comment ça marche ?</h2>
          <div className="home-steps-grid">
            {STEPS.map((s) => (
              <div className="home-step-card" key={s.number}>
                <span className="home-step-number">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-cta-banner">
          <h2>Prêt à suivre vos followers en direct ?</h2>
          <p>7 jours d’essai gratuit, sans engagement.</p>
          <button type="button" className="btn btn-fill" onClick={() => navigate('/register')}>
            Je m’inscris
          </button>
        </section>
      </main>
    </div>
  );
}
