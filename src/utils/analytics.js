// src/utils/analytics.js
export const loadGoogleAnalytics = () => {
  if (window.gtag) return;

  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2J98FCS7RV'; // 👉 remplace par ton ID GA
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-2J98FCS7RV'); // 👉 remplace ici aussi
  };
};
