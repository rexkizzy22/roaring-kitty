import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/Field.jsx';
import { money } from '../format.js';

export default function WithdrawFunds() {
  const { user, update, addTransaction } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ amount: '', method: 'Bank Transfer', destination: '' });
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!amount || amount <= 0) return setErr('Enter an amount greater than $0.');
    if (amount > user.balance) return setErr(`Amount exceeds your available balance of ${money(user.balance)}.`);
    if (f.destination.trim().length < 5) return setErr('Enter your account number or wallet address.');
    setErr('');
    update((u) => ({ ...u, balance: +(u.balance - amount).toFixed(2) }));
    addTransaction({ type: 'Withdrawal', amount, method: f.method, status: 'Pending', note: f.destination.trim() });
    toast(`Withdrawal of ${money(amount)} submitted.`);
    nav('/transactions');
  };

  return (
    <>
      <div className="page-head"><h1>Withdraw Funds</h1><p>Available to withdraw: {money(user.balance)}</p></div>
      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={submit} noValidate>
          {err && <div className="form-error" role="alert">{err}</div>}
          <Field id="amount" label="Amount (USD)" type="number" min="0" step="0.01" placeholder="0.00" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
          <Field id="method" label="Withdrawal method" as="select" value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>
            <option>Bank Transfer</option><option>Bitcoin</option><option>USDT</option>
          </Field>
          <Field id="dest" label="Account number or wallet address" placeholder="Where should we send it?" value={f.destination} onChange={(e) => setF({ ...f, destination: e.target.value })} />
          <button className="btn" type="submit">Request withdrawal</button>
        </form>
      </div>
    </>
  );
}
