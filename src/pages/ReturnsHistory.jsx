import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { money, shortStamp } from '../format.js';

export default function ReturnsHistory() {
  const { user } = useAuth();
  const active = user.investments.filter((i) => i.state === 'Active');
  return (
    <>
      <div className="page-head"><h1>Returns History</h1><p>Returns credited from your active investments.</p></div>
      <div className="card">
        {active.length === 0 ? (
          <div className="empty-state">
            <p>No returns yet. Returns appear here once an investment pays out.</p>
            <p style={{ marginTop: 14 }}><Link className="btn sm" to="/stock-market">Browse investments</Link></p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead><tr><th>Started</th><th>Investment</th><th>Invested</th><th>Returns</th></tr></thead>
              <tbody>
                {active.map((i) => (
                  <tr key={i.id}>
                    <td>{shortStamp(new Date(i.date))}</td>
                    <td>{i.title}{i.option ? ` · ${i.option}` : ''}</td>
                    <td>{money(i.amount)}</td>
                    <td className="text-green">{money(0)}</td>
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
