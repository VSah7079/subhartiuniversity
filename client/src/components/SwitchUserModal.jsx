import React from 'react';

export default function SwitchUserModal({ isOpen, onClose, onSelectRole }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Switch Login Portal</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <p className="modal-desc">Please choose the appropriate portal for your university role:</p>

        <div className="role-grid">
          <div className="role-card active-role">
            <div className="role-icon student-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="role-info">
              <strong>Student Portal</strong>
              <span>Active View (Enrollment & DOB)</span>
            </div>
            <span className="current-badge">Active</span>
          </div>

          <div
            className="role-card"
            onClick={() => {
              onSelectRole('faculty');
              onClose();
            }}
          >
            <div className="role-icon faculty-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="role-info">
              <strong>Faculty & Staff Login</strong>
              <span>Employee ID & Password</span>
            </div>
          </div>

          <div
            className="role-card"
            onClick={() => {
              onSelectRole('admin');
              onClose();
            }}
          >
            <div className="role-icon admin-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="role-info">
              <strong>ERP Administration</strong>
              <span>Administrative Officers & Dept Heads</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
