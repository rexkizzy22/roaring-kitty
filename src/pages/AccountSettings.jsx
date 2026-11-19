import { useState } from 'react';
import {
  Banknote, Bitcoin, CheckCircle2, CircleDollarSign, Command, Gem, Mail, Save, Shield, User, UserRound,
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/Field.jsx';
import { firstName } from '../format.js';
import { getUsers } from '../storage.js';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'withdrawal', label: 'Withdrawal', icon: CircleDollarSign },
  { id: 'password', label: 'Password', icon: Shield },
  { id: 'prefs', label: 'Preferences', icon: Command },
];

const CRYPTO = [
  { key: 'btc', name: 'Bitcoin (BTC)', short: 'Bitcoin', ph: 'Enter Bitcoin address', help: 'Enter your Bitcoin Address that will be used to withdraw your funds', icon: Bitcoin },
  { key: 'eth', name: 'Ethereum (ETH)', short: 'Ethereum', ph: 'Enter Ethereum address', help: 'Enter your Ethereum Address that will be used to withdraw your funds', icon: Gem },
  { key: 'ltc', name: 'Litecoin (LTC)', short: 'Litecoin', ph: 'Enter Litecoin address', help: 'Enter your Litecoin Address that will be used to withdraw your funds', icon: CircleDollarSign },
  { key: 'usdt', name: 'USDT (TRC20)', short: 'USDT', ph: 'Enter USDT.TRC20 address', help: 'Enter your USDT.TRC20 wallet Address that will be used to withdraw your funds', icon: CircleDollarSign },
];

const REQUIREMENTS = [
  'Must be at least 8 characters long',
  'Should contain at least one uppercase letter',
  'Should contain at least one number',
  'Should contain at least one special character',
];

function SimpleField({ id, label, error, as: As = 'input', className = '', ...rest }) {
  return (
    <div className="as-field">
      <label htmlFor={id}>{label}</label>
      <As id={id} className={`as-input ${className}`} {...rest} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default function AccountSettings() {
  const { user, update } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('personal');

  const [p, setP] = useState({ name: user.name, phone: user.phone || '', dob: user.dob || '', address: user.address || '' });
  const [pErr, setPErr] = useState('');

  const w0 = user.withdrawalInfo || {};
  const [w, setW] = useState({ bankName: '', accountName: '', accountNumber: '', swift: '', btc: '', eth: '', ltc: '', usdt: '', ...w0 });

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');

  const [prefs, setPrefs] = useState({ profit: true, expiry: true, ...(user.prefs || {}) });

  const saveProfile = (e) => {
    e.preventDefault();
    if (p.name.trim().length < 2) return setPErr('Enter your full name.');
    if (p.dob && (Date.now() - new Date(p.dob).getTime()) / (365.25 * 864e5) < 18) return setPErr('You must be 18 or older.');
    setPErr('');
    update((u) => ({ ...u, name: p.name.trim(), phone: p.phone, dob: p.dob, address: p.address }));
    toast('Profile updated.');
  };

  const saveWithdrawal = (e) => {
    e.preventDefault();
    update((u) => ({ ...u, withdrawalInfo: w }));
    toast('Withdrawal details saved.');
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (pw.current !== user.password) return setPwErr('Current password is incorrect.');
    if (pw.next.length < 8 || !/[A-Z]/.test(pw.next) || !/\d/.test(pw.next) || !/[^A-Za-z0-9]/.test(pw.next))
      return setPwErr('New password does not meet the requirements below.');
    if (pw.next !== pw.confirm) return setPwErr('New passwords do not match.');
    setPwErr('');
    update((u) => ({ ...u, password: pw.next }));
    setPw({ current: '', next: '', confirm: '' });
    toast('Password updated.');
  };

  const savePrefs = (e) => {
    e.preventDefault();
    update((u) => ({ ...u, prefs }));
    toast('Preferences saved.');
  };

  return (
    <>
      <section className="as-hero">
        <span className="orb o1" /><span className="orb o2" /><span className="orb o3" /><span className="orb o4" />
        <div className="as-hero-text">
          <h1>Account Settings</h1>
          <p>Manage your personal information and preferences</p>
        </div>
        <div className="as-hero-chip">
          <span className="sq"><UserRound size={28} /></span>
          <div><small>Account</small><b>{firstName(user.name)}</b></div>
        </div>
      </section>

      <section className="as-card">
        <div className="as-tabs" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              <Icon size={24} /> <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="as-body">
          {tab === 'personal' && (
            <form onSubmit={saveProfile} noValidate>
              {pErr && <div className="form-error" role="alert">{pErr}</div>}
              <div className="as-grid">
                <SimpleField id="fn" label="Full Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
                <SimpleField id="em" label="Email Address" value={user.email} readOnly className="ro" />
                <SimpleField id="ph" label="Phone Number" type="tel" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} />
                <SimpleField id="dob" label="Date of Birth" type="date" value={p.dob} onChange={(e) => setP({ ...p, dob: e.target.value })} />
                <SimpleField id="ct" label="Country" value={user.country || 'Nigeria'} readOnly className="ro" />
                <SimpleField id="ad" label="Address" as="textarea" rows={4} value={p.address} onChange={(e) => setP({ ...p, address: e.target.value })} />
              </div>
              <button className="as-btn" type="submit"><Save size={22} /> Update Profile</button>
            </form>
          )}

          {tab === 'withdrawal' && (
            <form onSubmit={saveWithdrawal} noValidate>
              <h3 className="as-section"><Banknote size={22} /> Bank Transfer Details</h3>
              <div className="as-grid">
                <SimpleField id="bn" label="Bank Name" placeholder="Enter bank name" value={w.bankName} onChange={(e) => setW({ ...w, bankName: e.target.value })} />
                <SimpleField id="an" label="Account Name" placeholder="Enter account name" value={w.accountName} onChange={(e) => setW({ ...w, accountName: e.target.value })} />
                <SimpleField id="anum" label="Account Number" placeholder="Enter account number" inputMode="numeric" value={w.accountNumber} onChange={(e) => setW({ ...w, accountNumber: e.target.value })} />
                <SimpleField id="sw" label="Swift Code" placeholder="Enter swift code" value={w.swift} onChange={(e) => setW({ ...w, swift: e.target.value })} />
              </div>
              <hr className="as-rule" />
              <h3 className="as-section"><CircleDollarSign size={22} /> Cryptocurrency Wallets</h3>
              <div className="as-grid wallets">
                {CRYPTO.map(({ key, name, ph, help, icon: Icon }) => (
                  <div className="as-field" key={key}>
                    <label htmlFor={key} className="coin"><span className={`coin-ico ${key}`}><Icon size={18} /></span>{name}</label>
                    <input id={key} className="as-input mono" placeholder={ph} value={w[key]} onChange={(e) => setW({ ...w, [key]: e.target.value })} />
                    <small className="help">{help}</small>
                  </div>
                ))}
              </div>
              <button className="as-btn" type="submit"><Save size={22} /> Save Changes</button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={savePassword} noValidate>
              {pwErr && <div className="form-error" role="alert">{pwErr}</div>}
              <div className="as-grid pw">
                <Field id="cp" label="Current Password" type="password" slashed value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
                <Field id="np" label="New Password" type="password" slashed value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
                <Field id="cn" label="Confirm New Password" type="password" slashed value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
              </div>
              <div className="as-req">
                <h4>Password Requirements</h4>
                <ul>{REQUIREMENTS.map((r) => (<li key={r}><CheckCircle2 size={20} /> {r}</li>))}</ul>
              </div>
              <button className="as-btn" type="submit"><Shield size={22} /> Update Password</button>
              <hr className="as-rule" style={{ marginTop: 40 }} />
              <div className="as-adv">
                <div>
                  <h3>Advanced Security</h3>
                  <p>Enhance your account security with two-factor authentication, device management, and login history.</p>
                </div>
                <button type="button" className="as-2fa" onClick={() => toast('Two-factor authentication is not available in this demo.', 'error')}>
                  <Shield size={18} /> Configure 2FA
                </button>
              </div>
            </form>
          )}

          {tab === 'prefs' && (
            <form onSubmit={savePrefs}>
              <h3 className="as-section"><Mail size={22} /> Email Notifications</h3>
              {[
                ['profit', 'Profit Notifications', 'Send me email when I get profit from investments'],
                ['expiry', 'Plan Expiration', 'Send me email when my investment plan expires'],
              ].map(([k, t, d]) => (
                <div className="as-pref" key={k}>
                  <div><b>{t}</b><span>{d}</span></div>
                  <div className="yn" role="group" aria-label={t}>
                    <button type="button" className={prefs[k] ? 'yes on' : 'yes'} aria-pressed={prefs[k]} onClick={() => setPrefs({ ...prefs, [k]: true })}>Yes</button>
                    <button type="button" className={!prefs[k] ? 'no on' : 'no'} aria-pressed={!prefs[k]} onClick={() => setPrefs({ ...prefs, [k]: false })}>No</button>
                  </div>
                </div>
              ))}
              <button className="as-btn" type="submit"><Save size={22} /> Save Preferences</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
