import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/Field.jsx';
import { money } from '../format.js';

export default function FundAccount() {
  const { user, update, addTransaction } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ amount: '', method: 'Bank Transfer', note: '' });
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!amount || amount < 10) return setErr('Enter an amount of at least $10.');
    if (amount > 1_000_000) return setErr('Maximum single deposit is $1,000,000.');
    setErr('');
    update((u) => ({ ...u, balance: +(u.balance + amount).toFixed(2) }));
    addTransaction({ type: 'Deposit', amount, method: f.method, note: f.note });
    toast(`Deposit of ${money(amount)} completed.`);
    nav('/transactions');
  };

  return (
    <>
      <div className="page-head"><h1>Fund Account</h1><p>Add money to your balance. Current balance: {money(user.balance)}</p></div>
      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={submit} noValidate>
          {err && <div className="form-error" role="alert">{err}</div>}
          <Field id="amount" label="Amount (USD)" type="number" min="10" step="0.01" placeholder="0.00" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
          <Field id="method" label="Payment method" as="select" value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>
            <option>Bank Transfer</option><option>Debit / Credit Card</option><option>Bitcoin</option><option>USDT</option>
          </Field>
          <Field id="note" label="Note (optional)" as="textarea" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
          <button className="btn" type="submit">Deposit funds</button>
        </form>
      </div>
    </>
  );
}
