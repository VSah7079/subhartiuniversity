import React, { useState } from 'react';

export default function AdminAuthModal({ isOpen, onClose, onSuccess, showToast }) {
  const [username, setUsername] = useState('svsu_admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFillDemo = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both Admin Username and Password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrator credentials.');
      }

      sessionStorage.setItem('svsu_admin_token', data.adminToken);
      sessionStorage.setItem('svsu_admin_user', JSON.stringify(data.admin || { username }));
      sessionStorage.setItem('svsu_admin_key', password.trim());

      showToast(`✔ Welcome ${data.admin?.designation || 'Administrator'}! Session authorized.`, 'success');
      setPassword('');
      onSuccess(data.adminToken, data.admin);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          padding: '24px 28px',
          borderRadius: '14px',
          border: '2px solid #1e3a8a',
          boxShadow: '0 20px 45px rgba(15, 33, 55, 0.3)'
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            borderBottom: '1.5px solid #e2e8f0',
            paddingBottom: '14px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #bfdbfe'
              }}
            >
              <span style={{ fontSize: '22px' }}>🛡️</span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0f2137', fontWeight: 800 }}>
                ERP Administrator Login
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                Swami Vivekanand Subharti University • Office of Registrar
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div style={{ background: '#f8fafc', borderLeft: '4px solid #1e3a8a', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
            <strong>Security Notice:</strong> Students are strictly restricted from editing marks, attendance or fee records. Only authorized university administrators with valid credentials can log in to edit data.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #ef4444',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              marginBottom: '16px',
              fontWeight: 600
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin Username Field */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>
              Administrator Username / ID *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. svsu_admin"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13.5px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Admin Password Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>
              Administrator Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter admin password"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials for Testing */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 12px', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '6px' }}>
              🔑 Official Admin Credentials (Click to Autofill):
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('svsu_admin', 'admin@svsu2026')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: '1px solid #93c5fd',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#1d4ed8'
                }}
              >
                👤 Super Admin (admin@svsu2026)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin', 'admin123')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: '1px solid #93c5fd',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#1d4ed8'
                }}
              >
                👤 Controller (admin123)
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '9px 18px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 22px',
                borderRadius: '6px',
                border: 'none',
                background: '#1e3a8a',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading ? 'Authenticating...' : '🔐 Sign In to Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
