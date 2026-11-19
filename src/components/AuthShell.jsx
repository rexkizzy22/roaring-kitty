import { CheckCircle2, Shield } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const features = [
  ['Secure Trading', 'State-of-the-art security features to protect your investments'],
  ['Real-Time Analytics', 'Up-to-the-minute market data to inform your decisions'],
  ['Expert Support', '24/7 customer support from our team of specialists'],
];

function HeroArt() {
  const faces = [
    { l: 108, t: 38 }, { l: 292, t: 24 }, { l: 62, t: 148 }, { l: 270, t: 168 }, { l: 210, t: 10 },
  ];
  return (
    <div className="hero-art" aria-hidden="true">
      <span className="chip" style={{ left: 8, top: 12 }}>PLAN</span>
      <span className="chip" style={{ left: 8, top: 100 }}>PROTOTYPE</span>
      <span className="chip" style={{ right: 20, top: 100 }}>PROJECTS</span>
      <span className="chip" style={{ right: 40, bottom: 4 }}>EXECUTE</span>
      {faces.map((f, i) => (
        <span key={i} className="face" style={{ left: f.l, top: f.t }} />
      ))}
      <div className="orb"><i /></div>
    </div>
  );
}

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <section className="auth-left">
        <Logo />
        <div className="auth-left-body">
          <HeroArt />
          <h1>Welcome to Roaring Kitty</h1>
          <p className="lead">
            Our platform offers secure trading, real-time market data, and expert insights to help you achieve your financial goals.
          </p>
          <ul className="features">
            {features.map(([t, d]) => (
              <li key={t}>
                <CheckCircle2 size={26} />
                <div><b>{t}</b><span>{d}</span></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="auth-right">
        <div className="mobile-logo"><Logo /> Roaring Kitty</div>
        <div className="theme-toggle" style={{ position: 'absolute', top: 24, right: 24 }}><ThemeToggle /></div>
        <div className="auth-card">
          <header>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </header>
          <div className="body">{children}</div>
        </div>
        <div className="secure-note"><Shield size={14} /> Secure login - Your data is protected</div>
        <div className="copyright">© 2026 Roaring Kitty. All rights reserved.</div>
      </section>
    </div>
  );
}
