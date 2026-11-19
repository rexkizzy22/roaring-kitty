import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Field({ label, id, icon: Icon, error, type = 'text', as, slashed, children, ...rest }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;
  const cls = `input ${Icon ? 'has-lead' : ''} ${isPassword ? 'has-trail' : ''}`;
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-wrap">
        {Icon && <Icon className="lead" size={20} />}
        {as === 'select' ? (
          <select id={id} className={cls} {...rest}>{children}</select>
        ) : as === 'textarea' ? (
          <textarea id={id} className={cls} rows={3} {...rest} />
        ) : (
          <input id={id} type={inputType} className={cls} {...rest} />
        )}
        {isPassword && (
          <button type="button" className="trail" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <Eye size={20} /> : slashed ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
