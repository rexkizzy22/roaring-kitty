import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity, Bell, Bot, ChevronDown, Coins, Download, History, Home, LogOut, Mail, Menu, TrendingUp, Upload, User, Users, Wallet, X,
} from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { firstName, initials, money } from '../format.js';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useToast } from './Toast.jsx';

const sections = [
  { title: 'MAIN', items: [
    { to: '/', label: 'Portfolio Overview', icon: Home, end: true },
    { to: '/account-settings', label: 'Account Settings', icon: User },
  ]},
  { title: 'FINANCE', items: [
    { to: '/fund-account', label: 'Fund Account', icon: Download },
    { to: '/withdraw', label: 'Withdraw Funds', icon: Upload },
    { to: '/transactions', label: 'Transaction History', icon: History },
  ]},
  { title: 'INVESTMENTS', items: [
    { to: '/stock-market', label: 'Stock Market', icon: TrendingUp },
    { to: '/diversified-fund', label: 'Diversified Fund', icon: Activity },
    { to: '/copy-trading', label: 'Copy Trading', icon: Users },
    { to: '/enhanced-crypto', label: 'Enhanced Crypto Funds', icon: Bot },
    { to: '/gme-pool', label: 'G.E.M Pool', icon: Coins },
    { to: '/returns-history', label: 'Returns History', icon: TrendingUp },
  ]},
];

function useOutsideClick(ref, onOut) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && onOut();
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, onOut]);
}

export default function Layout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null); // 'user' | 'bell' | null
  const menuRef = useRef(null);
  const location = useLocation();
  useOutsideClick(menuRef, () => setMenu(null));
  useEffect(() => { setOpen(false); setMenu(null); window.scrollTo(0, 0); }, [location.pathname]);

  const recent = user.transactions.slice(0, 4);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn" style={{ display: open ? 'grid' : 'none' }} onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="profile-card">
          <div className="avatar lg">{initials(user.name)}<span className="online" /></div>
          <h3>{firstName(user.name)}</h3>
          <div className="status">online</div>
          <div className="mini-balance">
            <span className="ico"><Wallet size={18} /></span>
            <div><small>Balance</small><b>{money(user.balance)}</b></div>
          </div>
        </div>
        <nav className="nav">
          {sections.map((s) => (
            <div key={s.title}>
              <h4>{s.title}</h4>
              {s.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icon size={22} /> <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />

      <div className="main">
        <header className="topbar" ref={menuRef}>
          <button className="icon-btn burger" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <ThemeToggle />
          <div className="menu-wrap">
            <button className="icon-btn" onClick={() => setMenu(menu === 'bell' ? null : 'bell')} aria-label="Notifications">
              <Bell size={20} />{recent.length > 0 && <span className="badge-dot" />}
            </button>
            {menu === 'bell' && (
              <div className="menu" style={{ minWidth: 270 }}>
                {recent.length === 0 ? <div className="empty">No notifications yet.</div> : recent.map((t) => (
                  <div key={t.id} style={{ padding: '10px 12px', fontSize: 14 }}>
                    <b>{t.type}</b> of {money(t.amount)} <span className="text-green">· {t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="menu-wrap">
            <button className="user-trigger" onClick={() => setMenu(menu === 'user' ? null : 'user')} aria-haspopup="menu">
              <span className="avatar">{initials(user.name)}</span>
              <span className="uname">{user.username}</span>
              <ChevronDown size={18} />
            </button>
            {menu === 'user' && (
              <div className="menu" role="menu">
                <Link to="/account-settings"><User size={16} /> Account Settings</Link>
                <button onClick={() => { logout(); toast('You have been signed out.'); }}><LogOut size={16} /> Sign out</button>
              </div>
            )}
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>

      <button className="jivo" onClick={() => toast('Live chat is not connected in this demo.', 'error')}>
        <span className="mail"><Mail size={22} /> Send us a message</span>
        <span className="brand">jivochat</span>
      </button>
    </div>
  );
}
