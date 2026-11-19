import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ id: '', pw: '', remember: false });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.id.trim() || !form.pw) return setError('Enter your username or email and password.');
    try {
      login(form.id, form.pw);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your account to continue">
      <form onSubmit={submit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}
        <Field id="id" label="Username or Email Address" icon={Mail} placeholder="you@example.com or username"
          value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} autoComplete="username" />
        <Field id="pw" label="Password" icon={Lock} type="password" placeholder="••••••••"
          value={form.pw} onChange={(e) => setForm({ ...form, pw: e.target.value })} autoComplete="current-password" />
        <div className="row-between">
          <label className="check">
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
            Remember me
          </label>
          <a className="link" href="#reset" onClick={(e) => { e.preventDefault(); setError('Password reset is not available in this demo.'); }}>Forgot password?</a>
        </div>
        <button className="btn block" type="submit"><LogIn size={20} /> Sign In</button>
        <p className="alt">Don't have an account? <Link className="link" to="/signup">Sign up now</Link></p>
      </form>
    </AuthShell>
  );
}
