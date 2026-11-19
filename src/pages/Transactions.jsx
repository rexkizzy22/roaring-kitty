import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { money, shortStamp } from '../format.js';

export default function Transactions() {
  const { user } = useAuth();
  const tx = user.transactions;
  return (
    <>
      <div className="page-head"><h1>Transaction History</h1><p>Every deposit, withdrawal and investment on your account.</p></div>
      <div className="card">
        {tx.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <p style={{ marginTop: 14 }}><Link className="btn sm" to="/fund-account">Fund your account</Link></p>
          </div>
        ) : (
          <div className="tbl-scroll" style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead><tr><th>Date</th><th>Type</th><th>Method / Details</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id}>
                    <td>{shortStamp(new Date(t.date))}</td>
                    <td>{t.type}</td>
                    <td>{t.method}{t.note ? <small style={{ display: 'block', color: 'var(--muted)' }}>{t.note}</small> : null}</td>
                    <td className={t.type === 'Deposit' ? 'text-green' : ''}>{t.type === 'Deposit' ? '+' : '-'}{money(t.amount)}</td>
                    <td><span className={`pill ${t.status === 'Completed' ? 'ok' : 'warn'}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
