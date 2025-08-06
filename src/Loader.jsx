// src/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Chargement...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '5px solid #ccc',
    borderTop: '5px solid var(--bg)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '10px',
  },
};

// Injecte l’animation CSS globalement
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Loader;
