import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import SwitchUserModal from './components/SwitchUserModal.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminEditorModal from './components/AdminEditorModal.jsx';
import AdminAuthModal from './components/AdminAuthModal.jsx';

export default function App() {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('svsu_token') || null);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminEditorOpen, setIsAdminEditorOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Notification helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Keyboard shortcut: Ctrl + Shift + A opens Master Admin Verification
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminAuthOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Restore saved session if present
  useEffect(() => {
    const savedStudent = localStorage.getItem('svsu_student_profile');
    if (savedStudent && token) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch {
        localStorage.removeItem('svsu_student_profile');
      }
    }
  }, [token]);

  // Handle successful login
  const handleLoginSuccess = (data) => {
    setToken(data.token);
    setStudent(data.student);
    localStorage.setItem('svsu_token', data.token);
    localStorage.setItem('svsu_student_profile', JSON.stringify(data.student));
  };

  // Handle Logout
  const handleLogout = () => {
    setStudent(null);
    setToken(null);
    localStorage.removeItem('svsu_token');
    localStorage.removeItem('svsu_student_profile');
    showToast('Signed out successfully from Subharti ERP.', 'info');
  };

  // Handle role selection from Switch User modal
  const handleSelectRole = (role) => {
    if (role === 'faculty') {
      showToast('Faculty & Staff Login Portal: Use employee credentials.', 'info');
    } else if (role === 'admin') {
      setIsAdminAuthOpen(true);
    }
  };

  // Handle student data updated from Admin Editor
  const handleStudentUpdated = (updatedStudent) => {
    // If updated student is the currently logged-in student, sync session state
    if (!student || student.enrollmentNo.toLowerCase() === updatedStudent.enrollmentNo.toLowerCase()) {
      setStudent(updatedStudent);
      localStorage.setItem('svsu_student_profile', JSON.stringify(updatedStudent));
    }
  };

  return (
    <div className={`app-root ${student ? 'app-in-erp' : 'app-in-login'}`}>
      {student ? (
        /* Authenticated Full ERP Student Dashboard Suite (STRICTLY READ-ONLY FOR STUDENTS) */
        <StudentDashboard
          student={student}
          onLogout={handleLogout}
          showToast={showToast}
        />
      ) : (
        /* Exact SVSU Student Login Form matching user's photo */
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchUser={() => setIsSwitchUserOpen(true)}
          showToast={showToast}
        />
      )}

      {/* Switch User Modal */}
      <SwitchUserModal
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
        onSelectRole={handleSelectRole}
      />

      {/* Admin Passcode Verification Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminEditorOpen(true);
        }}
        showToast={showToast}
      />

      {/* Master ERP Administration & Data Editor Modal (Restricted to Authorized Admins) */}
      <AdminEditorModal
        isOpen={isAdminEditorOpen}
        onClose={() => setIsAdminEditorOpen(false)}
        currentStudent={student}
        onStudentUpdated={handleStudentUpdated}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
