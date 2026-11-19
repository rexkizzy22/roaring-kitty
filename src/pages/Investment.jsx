import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/Field.jsx';
import { money, shortStamp } from '../format.js';

const tone = { red: 'text-red', green: 'text-green', yellow: 'text-yellow' };

export default function Investment({ cfg }) {
  const { user, update, addTransaction } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ amount: '', option: cfg.options?.[0] || '' });
  const [err, setErr] = useState('');
  const mine = user.investments.filter((i) => i.key === cfg.key);

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (cfg.open) {
      if (!amount || amount < cfg.min) return setErr(`Minimum amount is ${money(cfg.min || 1)}.`);
      if (amount > user.balance) return setErr(`Insufficient balance (${money(user.balance)}). Fund your account first.`);
      setErr('');
      update((u) => ({
        ...u,
        balance: +(u.balance - amount).toFixed(2),
        investments: [{ id: Math.random().toString(36).slice(2), key: cfg.key, title: cfg.title, option: f.option, amount, date: new Date().toISOString(), state: 'Active' }, ...u.investments],
      }));
      addTransaction({ type: 'Investment', amount, method: cfg.title, note: f.option });
      toast(`${cfg.action} confirmed: ${money(amount)}.`);
    } else {
      if (amount && amount < cfg.min) return setErr(`Minimum amount is ${money(cfg.min)}.`);
      setErr('');
      update((u) => ({
        ...u,
        investments: [{ id: Math.random().toString(36).slice(2), key: cfg.key, title: cfg.title, option: '', amount: amount || 0, date: new Date().toISOString(), state: 'Waitlisted' }, ...u.investments],
      }));
      toast(`You're on the ${cfg.title} waitlist.`);
    }
    setF({ ...f, amount: '' });
  };

  return (
    <>
      <div className="page-head"><h1>{cfg.title}</h1><p>{cfg.blurb}</p></div>
      <div className="two-col">
        <div className="card">
          <div className="invest-hero">
            <span className="status-tag"><Lock size={14} /> <span className={tone[cfg.tone]}>{cfg.status}</span></span>
          </div>
          <div className="facts">
            {cfg.rows.map(([a, b]) => (<div key={a}><small>{a}</small><b>{b}</b></div>))}
            <div><small>Your balance</small><b>{money(user.balance)}</b></div>
          </div>
          <form onSubmit={submit} noValidate>
            {err && <div className="form-error" role="alert">{err}</div>}
            {cfg.options && (
              <Field id="opt" label={cfg.key === 'stock' ? 'Stock' : 'Trader'} as="select" value={f.option} onChange={(e) => setF({ ...f, option: e.target.value })}>
                {cfg.options.map((o) => <option key={o}>{o}</option>)}
              </Field>
            )}
            <Field id="amt" label={cfg.open ? 'Amount (USD)' : 'Intended amount (USD, optional)'} type="number" min="0" step="0.01" placeholder="0.00" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
            <button className="btn" type="submit">{cfg.action}</button>
          </form>
        </div>
        <div className="card">
          <h2>Your activity</h2>
          {mine.length === 0 ? <div className="empty-state">Nothing here yet.</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tx-table" style={{ minWidth: 380 }}>
                <thead><tr><th>Date</th><th>Details</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {mine.map((i) => (
                    <tr key={i.id}>
                      <td>{shortStamp(new Date(i.date))}</td>
                      <td>{i.option || i.title}</td>
                      <td>{i.amount ? money(i.amount) : '—'}</td>
                      <td><span className={`pill ${i.state === 'Active' ? 'ok' : 'warn'}`}>{i.state}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
