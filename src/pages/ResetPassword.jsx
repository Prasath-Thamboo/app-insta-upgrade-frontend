import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Règles: 12+ caractères, ≥1 majuscule, ≥1 caractère spécial
  const checks = useMemo(() => ({
    length: newPassword.length >= 12,
    upper: /[A-Z]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  }), [newPassword]);

  const score = (checks.length ? 1 : 0) + (checks.upper ? 1 : 0) + (checks.special ? 1 : 0);
  const scorePct = [0, 33, 66, 100][score];
  const isPwdValid = score === 3;
  const barColor =
    score === 0 ? '#9aa0a6' :
    score < 3   ? '#ff9800' :
                  '#27ae60';

  const policyMsg = "Le mot de passe doit contenir au minimum 12 caractères, au moins une majuscule et un caractère spécial.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!isPwdValid) {
      setMessage(policyMsg);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password/${token}`,
        { newPassword }
      );
      setMessage(res.data.message || 'Mot de passe réinitialisé.');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur');
      setIsSuccess(false);
    }
  };

  return (
    <div className="body-sim" style={{ paddingInline: 20 }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Réinitialiser le mot de passe</h2>

        {message && (
          <p style={{
            color: isSuccess ? '#27ae60' : '#e74c3c',
            marginBottom: 12,
            textAlign: 'center',
            fontWeight: 600
          }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14, color: 'var(--simple-color)' }}>Nouveau mot de passe</span>

            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                aria-describedby="pwd-help pwd-meter"
                style={{ width: '100%', padding: '10px', paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                title={showPwd ? 'Masquer' : 'Afficher'}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1
                }}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Barre de progression */}
            <div id="pwd-meter" style={{ height: 8, background: 'rgba(0,0,0,0.15)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${scorePct}%`,
                  height: '100%',
                  background: barColor,
                  transition: 'width .25s ease'
                }}
              />
            </div>

            {/* Checklist */}
            <div
              id="pwd-help"
              style={{
                fontSize: 13,
                marginTop: 4,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.06)',
                color: 'var(--simple-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: checks.length ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                  {checks.length ? '✔' : '✖'}
                </span>
                12 caractères minimum
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: checks.upper ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                  {checks.upper ? '✔' : '✖'}
                </span>
                Au moins une majuscule
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: checks.special ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                  {checks.special ? '✔' : '✖'}
                </span>
                Au moins un caractère spécial
              </div>
            </div>
          </label>

          <button
            type="submit"
            disabled={!isPwdValid}
            style={{
              padding: '10px 20px',
              backgroundColor: isPwdValid ? 'var(--main-color)' : '#9aa0a6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: isPwdValid ? 'pointer' : 'not-allowed'
            }}
          >
            Réinitialiser
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
