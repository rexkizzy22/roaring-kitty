import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const [f, setF] = useState({ name: '', username: '', email: '', pw: '', pw2: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setFormError('');
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your full name.';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(f.username)) er.username = 'Use 3–20 letters, numbers or underscores.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (f.pw.length < 8) er.pw = 'Use at least 8 characters.';
    if (f.pw2 !== f.pw) er.pw2 = 'Passwords do not match.';
    setErrors(er);
    if (Object.keys(er).length) return;
    try {
      signup({ name: f.name.trim(), username: f.username, email: f.email, password: f.pw });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Sign up to start investing with Roaring Kitty">
      <form onSubmit={submit} noValidate>
        {formError && <div className="form-error" role="alert">{formError}</div>}
        <Field id="name" label="Full Name" icon={User} placeholder="Mercy Johnson" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field id="username" label="Username" icon={User} placeholder="username" value={f.username} onChange={set('username')} error={errors.username} autoComplete="username" />
        <Field id="email" label="Email Address" icon={Mail} type="email" placeholder="you@example.com" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field id="pw" label="Password" icon={Lock} type="password" placeholder="At least 8 characters" value={f.pw} onChange={set('pw')} error={errors.pw} autoComplete="new-password" />
        <Field id="pw2" label="Confirm Password" icon={Lock} type="password" placeholder="Repeat your password" value={f.pw2} onChange={set('pw2')} error={errors.pw2} autoComplete="new-password" />
        <button className="btn block" type="submit"><UserPlus size={20} /> Create Account</button>
        <p className="alt">Already have an account? <Link className="link" to="/login">Sign in</Link></p>
      </form>
    </AuthShell>
  );
}
