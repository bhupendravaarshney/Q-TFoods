import { useState, type FormEvent } from 'react';

type LoginProps = {
  onLogin?: (email: string, password: string) => Promise<void> | void;
  onRetry?: () => Promise<void> | void;
  busy?: boolean;
  error?: string | null;
};

const demoAccounts = [
  ['Sales', 'demo.user@qtfoods.local'],
  ['Operations', 'operations.user@qtfoods.local'],
  ['Finance', 'finance.user@qtfoods.local'],
  ['ERP Admin', 'admin.user@qtfoods.local'],
] as const;

export default function ACC_LOGIN({ onLogin, onRetry, busy = false, error }: LoginProps = {}) {
  const [email, setEmail] = useState('demo.user@qtfoods.local');
  const [password, setPassword] = useState('prototype');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onLogin?.(email.trim(), password);
  }

  return (
    <div className="auth-page auth-full-page">
      <section className="auth-brand">
        <div className="brand-lockup"><span className="brand-mark">Q&T</span><div><b>Q & T FOODS LTD</b><small>Manufacturing ERP + CRM</small></div></div>
        <div>
          <div className="eyebrow light">SECURE OPERATIONS</div>
          <h1>One ERP.<br />The right work.</h1>
          <p>Sign in to see only the companies, plants, modules, approvals, and records assigned to your role.</p>
        </div>
        <small>Authenticated sessions · scoped access · controlled workflow</small>
      </section>
      <section className="auth-form">
        <form className="auth-card" onSubmit={submit}>
          <div className="eyebrow">ACC-LOGIN</div>
          <h2>Welcome back</h2>
          <p className="auth-intro">Use a named account to enter the ERP workflow.</p>

          {error && (
            <div className="form-error" role="alert">
              <span>{error}</span>
              {onRetry && <button type="button" onClick={() => void onRetry()}>Retry connection</button>}
            </div>
          )}

          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          <button className="primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>

          <div className="demo-accounts">
            <span>Demo roles · password: <b>prototype</b></span>
            <div>
              {demoAccounts.map(([label, account]) => (
                <button type="button" key={account} className={email === account ? 'selected' : ''} onClick={() => setEmail(account)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
