import React, { useState } from 'react';

export default function AdminAuthModal({ isOpen, onClose, onSuccess, showToast }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter the administrator security passcode.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid passcode. Access denied.');
      }

      sessionStorage.setItem('svsu_admin_token', data.adminToken);
      sessionStorage.setItem('svsu_admin_key', password.trim());
      showToast('✔ Administrator identity verified successfully!', 'success');
      setPassword('');
      onSuccess(data.adminToken, password.trim());
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
        style={{ maxWidth: '440px', padding: '24px 28px', borderRadius: '12px', border: '1.5px solid #1e3a8a' }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0f2137', fontWeight: 800 }}>ERP Administration Access</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>Restricted to authorized university officers</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>

        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          Students are strictly prohibited from modifying ERP academic records. Enter the <strong>Master Administrative Passcode</strong> to unlock editor:
        </p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Master Admin Passcode *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter admin passcode"
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
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
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              💡 <strong>Security Passcode:</strong> <code>admin@svsu2026</code> (or <code>admin123</code>)
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                background: '#1e3a8a',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {loading ? 'Verifying...' : '🔓 Unlock Data Editor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
