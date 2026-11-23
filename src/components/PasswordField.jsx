import { useMemo, useState } from 'react';

// Règle : 12+ caractères, ≥1 majuscule, ≥1 caractère spécial
export function usePasswordChecks(password) {
  return useMemo(() => {
    const checks = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, isValid: score === 3 };
  }, [password]);
}

export const PASSWORD_POLICY =
  'Le mot de passe doit contenir au minimum 12 caractères, au moins une majuscule et un caractère spécial.';

const COLORS = ['transparent', '#f97316', '#f59e0b', '#16a34a'];

export default function PasswordField({
  id = 'password',
  label = 'Mot de passe',
  value,
  onChange,
  placeholder = '••••••••••••',
  showStrength = false,
  autoComplete = 'current-password',
}) {
  const [show, setShow] = useState(false);
  const { checks, score } = usePasswordChecks(value);

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <div className="input-group">
        <input
          id={id}
          className="input"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          aria-describedby={showStrength ? `${id}-rules` : undefined}
        />
        <button
          type="button"
          className="input-group__btn"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      {showStrength && (
        <>
          <div className="pwd-meter" aria-hidden="true">
            <div className="pwd-meter__bar" style={{ width: `${(score / 3) * 100}%`, background: COLORS[score] }} />
          </div>
          <ul className="pwd-rules" id={`${id}-rules`}>
            <li className={checks.length ? 'ok' : ''}>12 caractères minimum</li>
            <li className={checks.upper ? 'ok' : ''}>Au moins une majuscule</li>
            <li className={checks.special ? 'ok' : ''}>Au moins un caractère spécial</li>
          </ul>
        </>
      )}
    </div>
  );
}
