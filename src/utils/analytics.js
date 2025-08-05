// utils/analytics.js

export const loadGoogleAnalytics = () => {
  const consent = localStorage.getItem('cookie-consent');

  // ✅ Charger GA uniquement si consentement explicite
  if (consent !== 'true') return;

  // ✅ Empêcher le double chargement
  if (window.gtag) return;

  // ✅ Insère le script GA
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX`; // ⛳ Remplace par ton vrai ID
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX'); // ⛳ Remplace ici aussi
  };
};
