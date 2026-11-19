import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, ArrowUpRight, Award, Calendar, CheckCircle2, DollarSign, Eye, EyeOff, Gift, Lock, Minus, PlusCircle, ShieldCheck, TrendingUp, Users, Bot, Activity, Wallet,
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { firstName, initials, longDate, money, shortStamp } from '../format.js';
import { dashboardCards, investments } from '../investments.js';

const bannerIcon = { diversified: Activity, copy: Users, crypto: Bot, gme: TrendingUp };
const toneClass = { red: 'text-red', green: 'text-green', yellow: 'text-yellow' };

const MARKET = [
  { s: 'AAPL', n: 'Apple Inc.', p: 231.4, c: 1.2, v: 58.2, seed: 3 },
  { s: 'NVDA', n: 'NVIDIA Corp.', p: 142.8, c: 3.4, v: 214.5, seed: 7 },
  { s: 'TSLA', n: 'Tesla Inc.', p: 318.2, c: -2.1, v: 121.9, seed: 11 },
  { s: 'GME', n: 'GameStop Corp.', p: 27.9, c: 6.8, v: 74.3, seed: 5 },
  { s: 'MSFT', n: 'Microsoft Corp.', p: 428.1, c: 0.4, v: 21.7, seed: 2 },
  { s: 'AMZN', n: 'Amazon.com Inc.', p: 214.6, c: -0.9, v: 44.8, seed: 9 },
  { s: 'META', n: 'Meta Platforms', p: 612.3, c: -1.7, v: 17.6, seed: 13 },
];

function Spark({ seed, up }) {
  const pts = useMemo(() => {
    let y = 20, x = seed * 97;
    return Array.from({ length: 16 }, (_, i) => {
      x = (x * 9301 + 49297) % 233280;
      y = Math.max(4, Math.min(36, y + ((x / 233280) - (up ? 0.42 : 0.58)) * 9));
      return `${i * 6},${y.toFixed(1)}`;
    }).join(' ');
  }, [seed, up]);
  return (
    <svg width="90" height="40" viewBox="0 0 90 40" aria-hidden="true">
      <polyline fill="none" stroke={up ? '#4ade80' : '#f87171'} strokeWidth="2" points={pts} />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [tab, setTab] = useState('Active');
  const mask = (n) => (hidden ? '••••••' : money(n));

  const totals = useMemo(() => {
    const sum = (t) => user.transactions.filter((x) => x.type === t).reduce((a, x) => a + x.amount, 0);
    return { dep: sum('Deposit'), wd: sum('Withdrawal') };
  }, [user.transactions]);

  const rows = useMemo(() => {
    if (tab === 'Gainers') return MARKET.filter((m) => m.c > 0).sort((a, b) => b.c - a.c);
    if (tab === 'Losers') return MARKET.filter((m) => m.c < 0).sort((a, b) => a.c - b.c);
    return [...MARKET].sort((a, b) => b.v - a.v);
  }, [tab]);

  const kycDone = user.kyc?.status !== 'unverified';
  const profitChange = user.profit > 0 ? `+${money(user.profit)}` : 'No change';

  return (
    <>
      <section className="welcome">
        <div className="welcome-head">
          <div>
            <h1>Welcome back, {firstName(user.name)}!</h1>
            <div className="date">{longDate()}</div>
          </div>
          <Link to="/kyc" className={`kyc-btn ${kycDone ? 'done' : ''}`}>
            <ShieldCheck size={20} /> {kycDone ? 'KYC Submitted' : 'Verify KYC'}
          </Link>
        </div>

        <div className="welcome-grid">
          <div className="balance-card">
            <div className="title">
              <h3><Wallet size={26} /> Account Balance</h3>
              <button className="icon-btn" style={{ background: 'transparent' }} onClick={() => setHidden((h) => !h)} aria-label={hidden ? 'Show balance' : 'Hide balance'}>
                {hidden ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <div className="sub">Your current available balance</div>
            <div className="amount">{mask(user.balance)}</div>
            <div className="avail"><CheckCircle2 size={18} /> Available for Withdrawal</div>
            <div className="updated">Last updated: {shortStamp()}</div>
            <div className="balance-actions">
              <Link to="/fund-account"><PlusCircle size={18} /> Deposit</Link>
              <Link to="/withdraw"><ArrowUpRight size={18} /> Withdraw</Link>
            </div>
          </div>

          <div className="stat">
            <div className="stat-top">Total Profit <DollarSign size={20} /></div>
            <b>{mask(user.profit)}</b>
            <div className="foot"><Minus size={16} /> {profitChange}</div>
          </div>
          <div className="stat">
            <div className="stat-top">Bonus <span className="chip yellow"><Gift size={18} /></span></div>
            <b>{mask(user.bonus)}</b>
            <div className="foot y"><Award size={16} /> Rewards &amp; Promotions</div>
          </div>
          <div className="stat">
            <div className="stat-top">Total Deposit <span className="chip green"><ArrowDown size={18} /></span></div>
            <b>{mask(totals.dep)}</b>
            <div className="foot text-green"><Calendar size={16} /> All time</div>
          </div>
          <div className="stat">
            <div className="stat-top">Total Withdrawal <span className="chip green"><ArrowUp size={18} /></span></div>
            <b>{mask(totals.wd)}</b>
            <div className="foot text-green"><Calendar size={16} /> All time</div>
          </div>
        </div>
      </section>

      <section className="offerings" aria-label="Investment offerings">
        {dashboardCards.map((k) => {
          const c = investments[k];
          const Icon = bannerIcon[k];
          return (
            <Link key={k} to={`/${c.path}`} className="offer">
              <div className={`banner ${c.banner}`}><Icon size={40} /></div>
              <div className="info">
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
                <dl>
                  {c.rows.map(([a, b]) => (<div key={a}><dt>{a}</dt><dd>{b}</dd></div>))}
                  <div><dt>Status</dt><dd className={`status ${toneClass[c.tone]}`}><Lock size={13} /> {c.status}</dd></div>
                </dl>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="lower">
        <div className="market">
          <div className="tabs" role="tablist">
            {['Active', 'Gainers', 'Losers'].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className="tbl-scroll">
            <table className="mtable">
              <thead><tr><th>Symbol</th><th className="num">Price</th><th className="num">Change</th><th className="num">Volume (M)</th><th>Trend</th></tr></thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.s}>
                    <td><b>{m.s}</b><small>{m.n}</small></td>
                    <td className="num">${m.p.toFixed(2)}</td>
                    <td className={`num ${m.c >= 0 ? 'up' : 'down'}`}>{m.c >= 0 ? '+' : ''}{m.c.toFixed(1)}%</td>
                    <td className="num">{m.v.toFixed(1)}</td>
                    <td><Spark seed={m.seed} up={m.c >= 0} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="me-card">
          <div className="avatar">{initials(user.name)}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <ul>
            <li><span>Username</span> {user.username}</li>
            <li><span>Member since</span> {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</li>
            <li><span>KYC</span> {kycDone ? 'Pending review' : 'Not verified'}</li>
            <li><span>Investments</span> {user.investments.length}</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
