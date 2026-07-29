import React, { useState } from 'react';

export const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  className = 'form-control', 
  style = {}, 
  id, 
  name, 
  maxLength, 
  pattern,
  autoComplete
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        id={id}
        name={name}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        className={className}
        style={{ ...style, paddingRight: '42px' }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="password-toggle-btn"
        title={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        tabIndex="-1"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <i className={show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
      </button>
    </div>
  );
};
