import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import SwitchUserModal from './components/SwitchUserModal.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminEditorModal from './components/AdminEditorModal.jsx';
import AdminAuthModal from './components/AdminAuthModal.jsx';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

// Read initial session synchronously so page refresh (F5) NEVER logs out or flashes login
const getInitialSession = () => {
  try {
    const rawProfile = sessionStorage.getItem('svsu_student_profile') || localStorage.getItem('svsu_student_profile');
    const rawToken = sessionStorage.getItem('svsu_token') || localStorage.getItem('svsu_token');
    const loginTime = sessionStorage.getItem('svsu_login_timestamp') || localStorage.getItem('svsu_login_timestamp');

    if (!rawProfile || !rawToken) {
      return { student: null, token: null };
    }

    // 24 Hour Auto-Logout Check
    if (loginTime && Date.now() - Number(loginTime) > TWENTY_FOUR_HOURS) {
      sessionStorage.clear();
      localStorage.removeItem('svsu_student_profile');
      localStorage.removeItem('svsu_token');
      localStorage.removeItem('svsu_login_timestamp');
      return { student: null, token: null };
    }

    const parsed = JSON.parse(rawProfile);
    // Ensure both sessionStorage and localStorage have the session intact
    sessionStorage.setItem('svsu_student_profile', rawProfile);
    sessionStorage.setItem('svsu_token', rawToken);
    sessionStorage.setItem('svsu_login_timestamp', loginTime || String(Date.now()));

    return { student: parsed, token: rawToken };
  } catch (err) {
    sessionStorage.clear();
    return { student: null, token: null };
  }
};

export default function App() {
  const initialSession = getInitialSession();
  const [student, setStudent] = useState(initialSession.student);
  const [token, setToken] = useState(initialSession.token);
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

  // 24-hour automatic logout timer check
  useEffect(() => {
    const timer = setInterval(() => {
      const loginTime = sessionStorage.getItem('svsu_login_timestamp') || localStorage.getItem('svsu_login_timestamp');
      if (loginTime && Date.now() - Number(loginTime) > TWENTY_FOUR_HOURS) {
        handleLogout('Session expired after 24 hours. Please log in again.');
      }
    }, 60 * 1000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Background profile sync with server to fetch latest marksheets or admin changes
  useEffect(() => {
    if (token && student?.enrollmentNo) {
      // 1. Fetch via protected student profile endpoint
      fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.student) {
            setStudent(data.student);
            sessionStorage.setItem('svsu_student_profile', JSON.stringify(data.student));
            localStorage.setItem('svsu_student_profile', JSON.stringify(data.student));
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // Synchronize URL with /login/StudentLogin as requested
  useEffect(() => {
    const path = window.location.pathname;
    if (!student) {
      if (path === '/' || path === '' || path.toLowerCase() === '/login' || path.toLowerCase() === '/login/studentlogin') {
        if (path !== '/login/StudentLogin') {
          window.history.replaceState(null, '', '/login/StudentLogin');
        }
      }
    } else {
      if (path === '/login/StudentLogin' || path === '/') {
        window.history.replaceState(null, '', '/student/dashboard');
      }
    }
  }, [student]);

  // Handle successful login
  const handleLoginSuccess = (data) => {
    const now = Date.now();
    setToken(data.token);
    setStudent(data.student);
    sessionStorage.setItem('svsu_token', data.token);
    sessionStorage.setItem('svsu_student_profile', JSON.stringify(data.student));
    sessionStorage.setItem('svsu_login_timestamp', String(now));
    localStorage.setItem('svsu_token', data.token);
    localStorage.setItem('svsu_student_profile', JSON.stringify(data.student));
    localStorage.setItem('svsu_login_timestamp', String(now));
    window.history.pushState(null, '', '/student/dashboard');
  };

  // Handle Logout
  const handleLogout = (message = 'Signed out successfully from Subharti ERP.') => {
    setStudent(null);
    setToken(null);
    sessionStorage.clear();
    localStorage.removeItem('svsu_token');
    localStorage.removeItem('svsu_student_profile');
    localStorage.removeItem('svsu_login_timestamp');
    window.history.replaceState(null, '', '/login/StudentLogin');
    showToast(message, 'info');
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
    // ONLY sync active session if the edited student is indeed the currently logged-in student
    if (student && updatedStudent && student.enrollmentNo && updatedStudent.enrollmentNo &&
        student.enrollmentNo.toLowerCase() === updatedStudent.enrollmentNo.toLowerCase()) {
      setStudent(updatedStudent);
      sessionStorage.setItem('svsu_student_profile', JSON.stringify(updatedStudent));
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
          onStudentUpdated={handleStudentUpdated}
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
