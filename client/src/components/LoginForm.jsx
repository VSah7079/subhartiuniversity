import React, { useState, useRef } from 'react';

export default function LoginForm({ onLoginSuccess, onSwitchUser, showToast, onOpenAdmin }) {
  const [loginOption, setLoginOption] = useState('enrollment');
  const [identifier, setIdentifier] = useState('');
  const [dob, setDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const nativeDatePickerRef = useRef(null);

  // Smart Date of Birth Formatter (Auto-inserts slashes DD/MM/YYYY)
  const handleDobChange = (e) => {
    let digits = e.target.value.replace(/\D/g, ''); // Extract only digits
    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
    }
    if (digits.length >= 3) {
      formatted += '/' + digits.slice(2, 4);
    }
    if (digits.length >= 5) {
      formatted += '/' + digits.slice(4, 8);
    }

    setDob(formatted);
    if (errorMessage) setErrorMessage('');
  };

  // Handle native calendar picker
  const handleNativeCalendarChange = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [yyyy, mm, dd] = val.split('-');
      setDob(`${dd}/${mm}/${yyyy}`);
      if (errorMessage) setErrorMessage('');
    }
  };

  const triggerCalendar = () => {
    if (nativeDatePickerRef.current) {
      try {
        if (nativeDatePickerRef.current.showPicker) {
          nativeDatePickerRef.current.showPicker();
        } else {
          nativeDatePickerRef.current.click();
        }
      } catch {
        nativeDatePickerRef.current.click();
      }
    }
  };

  // Handle Form Submission with Strict Date Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim();
    const rawDob = dob.replace(/\D/g, ''); // Extract DDMMYYYY digits

    if (!cleanIdentifier) {
      setErrorMessage('Please enter your Student ID / Enrollment No.');
      return;
    }

    if (!rawDob) {
      setErrorMessage('Please enter your Date of Birth in DD/MM/YYYY format.');
      return;
    }

    if (rawDob.length !== 8) {
      setErrorMessage('Date of Birth must be 8 digits in DD/MM/YYYY format (e.g. 15/08/2002).');
      return;
    }

    // Validate Day, Month, Year
    const day = parseInt(rawDob.slice(0, 2), 10);
    const month = parseInt(rawDob.slice(2, 4), 10);
    const year = parseInt(rawDob.slice(4, 8), 10);

    if (day < 1 || day > 31) {
      setErrorMessage('Invalid Day! Day must be between 01 and 31.');
      return;
    }

    if (month < 1 || month > 12) {
      setErrorMessage('Invalid Month! Month must be between 01 and 12.');
      return;
    }

    if (year < 1950 || year > 2025) {
      setErrorMessage('Invalid Year! Please check the birth year.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginOption,
          identifier: cleanIdentifier,
          dob: rawDob
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid Enrollment No or Date of Birth.');
      }

      showToast(`Welcome, ${data.student.fullName}!`, 'success');
      onLoginSuccess(data);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillDemo = (id, birthDate) => {
    setIdentifier(id);
    setDob(birthDate);
    setErrorMessage('');
  };

  return (
    <div className="same-login-page-wrapper">
      {/* Exact Card matching the Photo */}
      <div className="same-form-card">
        {/* Card Title Lines */}
        <h1 className="same-title-line-1">Swami Vivekanand</h1>
        <h2 className="same-title-line-2">Subharti University</h2>
        <h3 className="same-title-line-3">Student Login</h3>

        {/* University Crest / Logo in Center */}
        <div className="same-logo-container">
          <img
            src="/svsu-logo.png"
            alt="Swami Vivekanand Subharti University Logo"
            className="same-crest-img"
          />
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="same-error-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="same-form-fields" noValidate>
          {/* Select Login Option */}
          <div className="same-field-group">
            <label htmlFor="loginOptionSelect" className="same-field-label">
              Select Login Option
            </label>
            <select
              id="loginOptionSelect"
              value={loginOption}
              onChange={(e) => setLoginOption(e.target.value)}
              className="same-select-input"
            >
              <option value="enrollment">Enrollment No</option>
              <option value="student_id">Student ID</option>
              <option value="roll_no">Roll Number</option>
              <option value="registration_no">Registration No</option>
            </select>
          </div>

          {/* Enter Student ID/Enrollment No */}
          <div className="same-field-group">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter Student ID/Enrollment No"
              className="same-text-input"
              autoComplete="username"
              required
            />
          </div>

          {/* Date of Birth Input with Smart DD/MM/YYYY formatting & Calendar Icon */}
          <div className="same-field-group">
            <div className="same-dob-input-wrapper">
              <input
                type="text"
                value={dob}
                onChange={handleDobChange}
                placeholder="Enter Date of Birth: DD/MM/YYYY"
                maxLength={10}
                className="same-text-input same-dob-field"
                autoComplete="bday"
                required
              />
              <button
                type="button"
                className="same-calendar-trigger-btn"
                onClick={triggerCalendar}
                title="Select date from calendar"
                aria-label="Open Calendar"
              >
                📅
              </button>
              <input
                type="date"
                ref={nativeDatePickerRef}
                onChange={handleNativeCalendarChange}
                className="same-hidden-native-date"
                tabIndex={-1}
              />
            </div>
            <span className="same-dob-format-hint">Format: DD/MM/YYYY (e.g. 15/08/2002)</span>
          </div>

          {/* SIGN IN Button */}
          <button
            type="submit"
            className="same-signin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

          {/* Switch User Link */}
          <div className="same-switch-user-row">
            <button
              type="button"
              className="same-switch-user-link"
              onClick={onSwitchUser}
            >
              Switch User
            </button>
            <span style={{ color: '#94a3b8', margin: '0 6px', fontSize: '12px' }}>•</span>
            <button
              type="button"
              className="same-switch-user-link admin-editor-link"
              onClick={onOpenAdmin}
              title="Open SVSU ERP Master Data Editor to edit student details"
            >
              ⚙️ Admin & Data Editor
            </button>
          </div>
        </form>

        {/* Quick Demo Helper Links (Discrete for Testing) */}
        <div className="same-demo-links">
          <span>Demo:</span>
          <button type="button" onClick={() => fillDemo('SVSU/2023/10892', '15/08/2002')}>
            Student 1 (15/08/2002)
          </button>
          <span>|</span>
          <button type="button" onClick={() => fillDemo('SVSU/2023/10893', '22/04/2003')}>
            Student 2 (22/04/2003)
          </button>
        </div>
      </div>

      {/* Copyright Badge below card matching photo */}
      <div className="same-copyright-badge">
        Copyright &copy; 2017 Subharti Infotech
      </div>
    </div>
  );
}
