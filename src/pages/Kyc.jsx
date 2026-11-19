import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/Field.jsx';

export default function Kyc() {
  const { user, update } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const k = user.kyc || {};
  const [f, setF] = useState({ legalName: k.legalName || user.name, dob: k.dob || '', country: k.country || '', idType: k.idType || 'Passport', idNumber: '' });
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!f.legalName.trim() || !f.dob || !f.country.trim() || f.idNumber.trim().length < 5)
      return setErr('Complete every field. ID number must be at least 5 characters.');
    const age = (Date.now() - new Date(f.dob).getTime()) / (365.25 * 864e5);
    if (age < 18) return setErr('You must be 18 or older to verify your account.');
    setErr('');
    // Only the last 4 characters of the ID are kept in localStorage.
    update((u) => ({ ...u, kyc: { status: 'pending', legalName: f.legalName.trim(), dob: f.dob, country: f.country.trim(), idType: f.idType, idLast4: f.idNumber.trim().slice(-4) } }));
    toast('KYC details submitted for review.');
    nav('/');
  };

  return (
    <>
      <div className="page-head"><h1>Verify KYC</h1><p>Confirm your identity to unlock deposits and withdrawals at higher limits.</p></div>
      <form className="card" style={{ maxWidth: 720 }} onSubmit={submit} noValidate>
        {k.status === 'pending' && <div className="form-error" style={{ background: 'var(--green-soft)', borderColor: 'transparent', color: 'var(--green-text)' }}><ShieldCheck size={16} style={{ verticalAlign: -3 }} /> Submitted. You can update the details below.</div>}
        {err && <div className="form-error" role="alert">{err}</div>}
        <div className="form-grid">
          <div className="full"><Field id="ln" label="Legal full name" value={f.legalName} onChange={(e) => setF({ ...f, legalName: e.target.value })} /></div>
          <Field id="dob" label="Date of birth" type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} />
          <Field id="ctry" label="Country of residence" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
          <Field id="idt" label="ID type" as="select" value={f.idType} onChange={(e) => setF({ ...f, idType: e.target.value })}>
            <option>Passport</option><option>National ID</option><option>Driver's license</option>
          </Field>
          <Field id="idn" label="ID number" value={f.idNumber} onChange={(e) => setF({ ...f, idNumber: e.target.value })} placeholder={k.idLast4 ? `Ending in ${k.idLast4}` : ''} />
        </div>
        <button className="btn" type="submit">Submit for review</button>
      </form>
    </>
  );
}
