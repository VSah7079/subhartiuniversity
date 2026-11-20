import React, { useState } from 'react';
import {
  downloadIdCard,
  downloadFeeReceipt,
  downloadAdmitCard,
  downloadMarksheet,
  downloadOfficialLetter,
  downloadNotice
} from '../utils/documentGenerator.js';

export default function StudentDashboard({ student, onLogout, showToast, onOpenAdmin }) {
  // Navigation active tab: 'dashboard' | 'profile' | 'documents' | 'fees' | 'attendance' | 'examination' | 'results' | 'notices'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selected semester for results view
  const [selectedResultSemester, setSelectedResultSemester] = useState(
    student.results && student.results.length > 0 ? student.results[0].semester : 'Semester 4'
  );

  // Selected notice for view modal
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Fallback defaults if data fields are not set or empty
  const subjectsAttendance = (student.subjectsAttendance && student.subjectsAttendance.length > 0) ? student.subjectsAttendance : [
    { code: 'CSE-501', name: 'Database Management Systems', total: 42, attended: 39, percentage: 92.8, teacher: 'Dr. Amit Vashistha' },
    { code: 'CSE-502', name: 'Design & Analysis of Algorithms', total: 40, attended: 35, percentage: 87.5, teacher: 'Prof. Neha Gupta' },
    { code: 'CSE-503', name: 'Web Technologies & MERN Stack', total: 44, attended: 42, percentage: 95.4, teacher: 'Er. Sachin Tyagi' },
    { code: 'CSE-504', name: 'Operating Systems & Cloud Architecture', total: 38, attended: 32, percentage: 84.2, teacher: 'Dr. Vivek Kumar' },
    { code: 'CSE-505', name: 'Microprocessor & Interfacing', total: 36, attended: 31, percentage: 86.1, teacher: 'Prof. Manoj Sharma' },
    { code: 'CSE-506P', name: 'Database Systems Lab', total: 20, attended: 19, percentage: 95.0, teacher: 'Er. Sachin Tyagi' }
  ];

  const feeTransactions = (student.feeTransactions && student.feeTransactions.length > 0) ? student.feeTransactions : [
    { receiptNo: 'REC/2026/0942', date: '14 July 2026', semester: 'Semester 5', amount: 62500, mode: 'Online Netbanking (HDFC)', status: 'Cleared', purpose: 'Tuition & Development Fee' },
    { receiptNo: 'REC/2026/0128', date: '10 Jan 2026', semester: 'Semester 4', amount: 62500, mode: 'UPI / QR Payment (PhonePe)', status: 'Cleared', purpose: 'Tuition & Examination Fee' },
    { receiptNo: 'REC/2025/0811', date: '22 July 2025', semester: 'Semester 3', amount: 60000, mode: 'Online Netbanking (SBI)', status: 'Cleared', purpose: 'Tuition & Lab Fee' }
  ];

  const examSchedule = (student.examSchedule && student.examSchedule.length > 0) ? student.examSchedule : [
    { date: '02 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-501', subjectName: 'Database Management Systems', room: 'Hall B-204, FET Block', status: 'Upcoming' },
    { date: '05 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-502', subjectName: 'Design & Analysis of Algorithms', room: 'Hall B-204, FET Block', status: 'Upcoming' },
    { date: '08 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-503', subjectName: 'Web Technologies & MERN Stack', room: 'Hall A-102, Main Block', status: 'Upcoming' },
    { date: '11 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-504', subjectName: 'Operating Systems & Cloud Architecture', room: 'Hall A-102, Main Block', status: 'Upcoming' }
  ];

  const resultsList = (student.results && student.results.length > 0) ? student.results : [
    {
      semester: 'Semester 4',
      examSession: 'June 2026',
      sgpa: 8.75,
      totalCredits: 24,
      status: 'PASSED WITH DISTINCTION',
      subjects: [
        { code: 'CSE-401', name: 'Computer Organization & Architecture', internal: 26, external: 62, total: 88, grade: 'A+', credits: 4 },
        { code: 'CSE-402', name: 'Theory of Computation', internal: 24, external: 58, total: 82, grade: 'A', credits: 4 },
        { code: 'CSE-403', name: 'Object Oriented Programming (Java)', internal: 28, external: 65, total: 93, grade: 'O', credits: 4 },
        { code: 'CSE-404', name: 'Discrete Mathematics', internal: 25, external: 55, total: 80, grade: 'A', credits: 4 },
        { code: 'CSE-405', name: 'Software Engineering', internal: 27, external: 60, total: 87, grade: 'A+', credits: 4 }
      ]
    }
  ];

  const noticesList = (student.notices && student.notices.length > 0) ? student.notices : [
    {
      id: 'notice-1',
      title: 'Odd Semester Regular & Carry-Over Examination Schedule 2026-27',
      refNo: 'SVSU/EXAM/2026/1084',
      date: '18 Nov 2026',
      category: 'Examination',
      description: 'The end-semester examinations for all B.Tech/M.Tech and BCA students are scheduled to begin from 02 December 2026. Hall tickets can now be downloaded from the student ERP.',
      signatory: 'Controller of Examinations, Swami Vivekanand Subharti University'
    },
    {
      id: 'notice-2',
      title: 'Pre-Placement Drive & Technical Mock Interviews by Infosys & Wipro',
      refNo: 'SVSU/TPO/2026/512',
      date: '12 Nov 2026',
      category: 'Placement',
      description: 'Training and Placement Cell is organizing a campus technical mock drive for 5th & 7th semester engineering students on 28th Nov 2026 in the Central Auditorium.',
      signatory: 'Head, Training & Placement Cell, SVSU Meerut'
    },
    {
      id: 'notice-3',
      title: 'Annual TechFest "Subharti Hackathon 2026" Problem Statements Released',
      refNo: 'SVSU/CSE/2026/89',
      date: '05 Nov 2026',
      category: 'Event',
      description: 'Subharti Innovation & Incubation Council invites registrations for the 36-hour National Hackathon. Cash prizes up to Rs. 2,00,000 for top 3 teams.',
      signatory: 'Faculty Advisor, Incubation Council'
    }
  ];

  // Helper actions
  const handleDownloadIdCard = () => {
    downloadIdCard(student);
    showToast('Student ID Card opened for Download/Printing!', 'success');
  };

  const handleDownloadReceipt = (tx) => {
    downloadFeeReceipt(student, tx);
    showToast(`Fee Receipt (${tx.receiptNo}) generated!`, 'success');
  };

  const handleDownloadAdmit = () => {
    downloadAdmitCard(student);
    showToast('Examination Admit Card / Hall Ticket generated!', 'success');
  };

  const handleDownloadResult = () => {
    const currentRes = resultsList.find((r) => r.semester === selectedResultSemester) || resultsList[0];
    downloadMarksheet(student, currentRes);
    showToast(`Official Marksheet for ${currentRes.semester} generated!`, 'success');
  };

  const handleDownloadLetter = (letterType) => {
    downloadOfficialLetter(student, letterType);
    showToast(`Official ${letterType === 'bonafide' ? 'Bonafide' : 'Character'} Certificate generated!`, 'success');
  };

  const handleDownloadNoticeLetter = (notice) => {
    downloadNotice(notice);
    showToast(`Official Circular (${notice.refNo}) generated!`, 'success');
  };

  // Currently active result dataset
  const activeResult = resultsList.find((r) => r.semester === selectedResultSemester) || resultsList[0];

  return (
    <div className="erp-app-shell">
      {/* Top University Portal Bar */}
      <header className="erp-top-navbar">
        <div className="navbar-brand-section">
          <div className="erp-logo-icon">
            <img src="/svsu-logo.png" alt="SVSU Logo" className="erp-logo-img" />
          </div>
          <div>
            <h1 className="erp-univ-name">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p className="erp-portal-subtitle">Student ERP Academic Information System • Meerut</p>
          </div>
        </div>

        <div className="navbar-user-section">
          <div className="quick-pill-accreditation">NAAC 'A' Grade</div>
          <div className="student-profile-chip" onClick={() => setActiveTab('profile')}>
            <div className="chip-avatar">
              {student.fullName ? student.fullName.charAt(0) : 'S'}
            </div>
            <div className="chip-meta">
              <strong>{student.fullName}</strong>
              <span>{student.enrollmentNo}</span>
            </div>
          </div>
          <button className="erp-admin-btn" onClick={onOpenAdmin} title="Open Master ERP Data Editor to change student details">
            <span>⚙️ Edit ERP Data</span>
          </button>
          <button className="erp-logout-btn" onClick={onLogout} title="Sign Out of Session">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main ERP Layout: Sidebar + Content */}
      <div className="erp-body-layout">
        {/* Left Navigation Sidebar */}
        <aside className="erp-sidebar">
          <nav className="erp-nav-menu">
            <button
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="tab-icon">📊</span>
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="tab-icon">👤</span>
              <span>Student Profile</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <span className="tab-icon">🪪</span>
              <span>Documents & ID Card</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              <span className="tab-icon">💳</span>
              <span>Fees Detail</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="tab-icon">📅</span>
              <span>Attendance</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'examination' ? 'active' : ''}`}
              onClick={() => setActiveTab('examination')}
            >
              <span className="tab-icon">📝</span>
              <span>Examination</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <span className="tab-icon">🏆</span>
              <span>Results</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              <span className="tab-icon">📜</span>
              <span>Letters & Notices</span>
            </button>
          </nav>

          {/* Quick Direct Download Action Buttons in Sidebar */}
          <div className="sidebar-fast-actions">
            <h4>Quick Downloads</h4>
            <button className="sidebar-action-btn" onClick={handleDownloadIdCard}>
              <span>🪪</span> Download ID Card
            </button>
            <button className="sidebar-action-btn" onClick={handleDownloadAdmit}>
              <span>🎫</span> Download Admit Card
            </button>
            <button className="sidebar-action-btn" onClick={() => handleDownloadReceipt(feeTransactions[0])}>
              <span>🧾</span> Latest Fee Receipt
            </button>
            <button className="sidebar-action-btn" onClick={handleDownloadResult}>
              <span>📑</span> Download Marksheet
            </button>
          </div>

          <div className="sidebar-contact-card">
            <strong>ERP Central Helpline</strong>
            <p>☎ 0121-2439043 / 2439052</p>
            <p>✉ helpdesk@subharti.org</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="erp-main-content">
          {/* ========================================================
              1. DASHBOARD OVERVIEW TAB
          ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="tab-view-container animate-fade">
              {/* Student Hero Banner */}
              <div className="erp-welcome-banner">
                <div className="banner-left">
                  <div className="welcome-avatar-lg">
                    {student.fullName ? student.fullName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <span className="badge-academic-session">Academic Session: 2026-2027</span>
                    <h2>Welcome back, {student.fullName}!</h2>
                    <p className="banner-sub">
                      {student.course} • Semester {student.semester} • Enrollment: <strong>{student.enrollmentNo}</strong>
                    </p>
                    <div className="banner-tags-row">
                      <span className="hero-tag dept-tag">{student.department}</span>
                      <span className="hero-tag status-tag">✔ Regular Student (Active)</span>
                    </div>
                  </div>
                </div>

                <div className="banner-quick-actions">
                  <button className="hero-cta-btn" onClick={handleDownloadIdCard}>
                    <span>🪪</span> Print / Download ID Card
                  </button>
                  <button className="hero-cta-btn secondary" onClick={handleDownloadAdmit}>
                    <span>📝</span> Download Hall Ticket
                  </button>
                </div>
              </div>

              {/* 4 Core KPI Stats Cards */}
              <div className="stats-kpi-grid">
                <div className="kpi-card" onClick={() => setActiveTab('attendance')}>
                  <div className="kpi-header">
                    <span>Overall Attendance</span>
                    <span className="kpi-icon">📊</span>
                  </div>
                  <div className="kpi-value">{student.attendance || 88.5}%</div>
                  <div className="progress-bar-shell">
                    <div className="progress-bar-fill" style={{ width: `${student.attendance || 88.5}%` }}></div>
                  </div>
                  <span className="kpi-note green-note">✔ Eligible for End-Sem Exam (Above 75%)</span>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('results')}>
                  <div className="kpi-header">
                    <span>Cumulative CGPA</span>
                    <span className="kpi-icon">⭐</span>
                  </div>
                  <div className="kpi-value">{student.cgpa || 8.64} <span className="scale">/ 10</span></div>
                  <div className="progress-bar-shell">
                    <div className="progress-bar-fill gold-fill" style={{ width: `${((student.cgpa || 8.64) / 10) * 100}%` }}></div>
                  </div>
                  <span className="kpi-note gold-note">Grade: A+ (First Class with Distinction)</span>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('fees')}>
                  <div className="kpi-header">
                    <span>Fee Clearance</span>
                    <span className="kpi-icon">💳</span>
                  </div>
                  <div className="kpi-value status-cleared">NO DUES</div>
                  <div className="progress-bar-shell">
                    <div className="progress-bar-fill green-fill" style={{ width: '100%' }}></div>
                  </div>
                  <span className="kpi-note green-note">All dues paid for Semester {student.semester}</span>
                </div>

                <div className="kpi-card" onClick={() => setActiveTab('examination')}>
                  <div className="kpi-header">
                    <span>Upcoming Examinations</span>
                    <span className="kpi-icon">📝</span>
                  </div>
                  <div className="kpi-value">{examSchedule.length} Papers</div>
                  <div className="progress-bar-shell">
                    <div className="progress-bar-fill orange-fill" style={{ width: '80%' }}></div>
                  </div>
                  <span className="kpi-note orange-note">Starts 02 Dec 2026 • Roll #{student.rollNo}</span>
                </div>
              </div>

              {/* Two Column Grid: Upcoming Exams & Recent Notices */}
              <div className="dashboard-double-grid">
                {/* Upcoming Examination Schedule preview */}
                <div className="dash-panel-card">
                  <div className="panel-card-header">
                    <div>
                      <h3>Upcoming Examination Schedule</h3>
                      <p>Odd Semester Regular Exams (December 2026)</p>
                    </div>
                    <button className="panel-action-link" onClick={() => setActiveTab('examination')}>
                      View Full Schedule ➔
                    </button>
                  </div>

                  <div className="dash-exam-list">
                    {examSchedule.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="dash-exam-row">
                        <div className="exam-date-badge">
                          <strong>{item.date.split(' ')[0]}</strong>
                          <span>{item.date.split(' ')[1]}</span>
                        </div>
                        <div className="exam-info-col">
                          <strong>{item.subjectName}</strong>
                          <span>Code: {item.subjectCode} • Time: {item.time}</span>
                          <span className="room-meta">📍 {item.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="panel-bottom-cta-btn" onClick={handleDownloadAdmit}>
                    <span>🎫</span> Download Official Examination Admit Card
                  </button>
                </div>

                {/* Recent University Notices Preview */}
                <div className="dash-panel-card">
                  <div className="panel-card-header">
                    <div>
                      <h3>Official Notices & Circulars</h3>
                      <p>Latest notifications from SVSU Registrar Office</p>
                    </div>
                    <button className="panel-action-link" onClick={() => setActiveTab('notices')}>
                      View All ({noticesList.length}) ➔
                    </button>
                  </div>

                  <div className="dash-notices-list">
                    {noticesList.map((notice, idx) => (
                      <div key={idx} className="dash-notice-item">
                        <div className="notice-category-tag">{notice.category}</div>
                        <h4 onClick={() => setSelectedNotice(notice)}>{notice.title}</h4>
                        <div className="notice-footer-meta">
                          <span>Ref: {notice.refNo}</span>
                          <span>📅 {notice.date}</span>
                          <button
                            className="notice-dl-pill"
                            onClick={() => handleDownloadNoticeLetter(notice)}
                            title="Download official circular letter"
                          >
                            ⬇ Download Letter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. STUDENT PROFILE TAB
          ======================================================== */}
          {activeTab === 'profile' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Student Profile & Academic Record</h2>
                  <p>Comprehensive identity, parentage, and departmental enrollment data</p>
                </div>
                <button className="header-action-btn" onClick={handleDownloadIdCard}>
                  <span>🪪</span> Print Student ID Card
                </button>
              </div>

              {/* Profile Top Card */}
              <div className="profile-identity-banner">
                <div className="id-avatar-box">
                  <span className="avatar-img-placeholder">👨‍🎓</span>
                  <span className="verified-badge">VERIFIED</span>
                </div>
                <div className="id-title-box">
                  <h2>{student.fullName}</h2>
                  <p className="lead-course">{student.course} ({student.academicYear})</p>
                  <p className="lead-dept">{student.department}</p>
                  <div className="lead-tags">
                    <span className="id-tag">Enrollment: <strong>{student.enrollmentNo}</strong></span>
                    <span className="id-tag">Roll No: <strong>{student.rollNo}</strong></span>
                    <span className="id-tag">Student ID: <strong>{student.studentId}</strong></span>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Details Grid */}
              <div className="profile-details-grid">
                {/* Box 1: Personal Details */}
                <div className="info-block-card">
                  <h3 className="block-title"><span>👤</span> Personal & Parentage Details</h3>
                  <div className="data-table">
                    <div className="data-row">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">{student.fullName}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Father's Name</span>
                      <span className="data-value">{student.fatherName || 'Shri Rajesh Sharma'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Mother's Name</span>
                      <span className="data-value">{student.motherName || 'Smt. Sunita Sharma'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Date of Birth</span>
                      <span className="data-value">
                        {student.dob ? `${student.dob.slice(0, 2)} / ${student.dob.slice(2, 4)} / ${student.dob.slice(4, 8)}` : '15 / 08 / 2002'}
                      </span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Gender</span>
                      <span className="data-value">{student.gender || 'Male'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Blood Group</span>
                      <span className="data-value blood-val">{student.bloodGroup || 'B+'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Social Category</span>
                      <span className="data-value">{student.category || 'General'}</span>
                    </div>
                  </div>
                </div>

                {/* Box 2: Academic & Department Details */}
                <div className="info-block-card">
                  <h3 className="block-title"><span>🎓</span> Academic & Institutional Details</h3>
                  <div className="data-table">
                    <div className="data-row">
                      <span className="data-label">Enrolled Program</span>
                      <span className="data-value">{student.course}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Specialization Branch</span>
                      <span className="data-value">{student.branch || student.course}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Current Semester</span>
                      <span className="data-value sem-val">Semester {student.semester}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Department / Faculty</span>
                      <span className="data-value">{student.department}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Admission Date</span>
                      <span className="data-value">{student.admissionDate || '12 August 2023'}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Academic Batch</span>
                      <span className="data-value">{student.academicYear}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Faculty Mentor / HOD</span>
                      <span className="data-value">{student.mentorName || 'Dr. RK Sharma (Professor & Head)'}</span>
                    </div>
                  </div>
                </div>

                {/* Box 3: Contact & Communication */}
                <div className="info-block-card">
                  <h3 className="block-title"><span>📞</span> Contact Information</h3>
                  <div className="data-table">
                    <div className="data-row">
                      <span className="data-label">Student Mobile</span>
                      <span className="data-value">{student.phone}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Guardian / Parent Phone</span>
                      <span className="data-value">{student.guardianPhone}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Institutional Email</span>
                      <span className="data-value">{student.email}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Residential Address</span>
                      <span className="data-value">{student.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. DOCUMENTS & ID CARD TAB
          ======================================================== */}
          {activeTab === 'documents' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Official University Documents & Identity Card</h2>
                  <p>Download and print verified university credentials, certificates, and ID card</p>
                </div>
              </div>

              {/* ID Card Display Card */}
              <div className="id-card-showcase-container">
                <div className="id-card-preview-box">
                  <div className="card-top-crest-bar">
                    <div className="card-logo-mini">
                      <img src="/svsu-logo.png" alt="SVSU Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4>SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h4>
                      <p>STUDENT IDENTITY CARD • NAAC 'A' GRADE</p>
                    </div>
                  </div>

                  <div className="card-inner-body">
                    <div className="card-photo-col">
                      <div className="card-photo-frame">👨‍🎓</div>
                      <span className="photo-label">STUDENT</span>
                    </div>
                    <div className="card-details-col">
                      <h3>{student.fullName}</h3>
                      <p><strong>Enrollment:</strong> <span className="highlight-enr">{student.enrollmentNo}</span></p>
                      <p><strong>Roll No:</strong> {student.rollNo}</p>
                      <p><strong>Course:</strong> {student.course}</p>
                      <p><strong>Blood Group:</strong> <span className="blood-red">{student.bloodGroup || 'B+'}</span></p>
                      <p><strong>Emergency:</strong> {student.phone}</p>
                    </div>
                  </div>

                  <div className="card-footer-strip">
                    <div className="barcode-mock">||| | |||| | ||||| ||||</div>
                    <div className="validity-text">VALID TILL: JUNE 2027</div>
                    <div className="signature-mock">REGISTRAR</div>
                  </div>
                </div>

                <div className="id-download-cta-panel">
                  <h3>University Student Identity Card</h3>
                  <p>
                    Official verifiable student identity card for campus entry, library access, laboratory usage, and examination verification.
                  </p>
                  <ul className="id-card-features">
                    <li>✔ High-resolution printable PDF format</li>
                    <li>✔ Includes official university watermark & seal</li>
                    <li>✔ Barcode encoded with enrollment record</li>
                  </ul>
                  <button className="primary-download-btn" onClick={handleDownloadIdCard}>
                    <span>🪪</span> Download Official ID Card (PDF / Print)
                  </button>
                </div>
              </div>

              {/* Certificates & Letters Section */}
              <div className="letters-section-container">
                <h3>Official Certificates & Letters Repository</h3>
                <p>Click any document to generate, view, and download an official letterhead certificate:</p>

                <div className="letters-grid">
                  {/* Bonafide Certificate */}
                  <div className="letter-item-card">
                    <div className="letter-icon">📜</div>
                    <div className="letter-info">
                      <h4>Bonafide Student Certificate</h4>
                      <p>Official certificate stating enrolled status for passport, visa, education loan, or government schemes.</p>
                      <span className="ref-badge">Ref: SVSU/REG/BONA/2026</span>
                    </div>
                    <button className="letter-download-btn" onClick={() => handleDownloadLetter('bonafide')}>
                      <span>⬇</span> Download Letter
                    </button>
                  </div>

                  {/* Character Certificate */}
                  <div className="letter-item-card">
                    <div className="letter-icon">🏅</div>
                    <div className="letter-info">
                      <h4>Character & Conduct Certificate</h4>
                      <p>Verified university letter confirming student's exemplary conduct and disciplined tenure.</p>
                      <span className="ref-badge">Ref: SVSU/REG/CHAR/2026</span>
                    </div>
                    <button className="letter-download-btn" onClick={() => handleDownloadLetter('character')}>
                      <span>⬇</span> Download Letter
                    </button>
                  </div>

                  {/* Fee Clearance Certificate */}
                  <div className="letter-item-card">
                    <div className="letter-icon">🧾</div>
                    <div className="letter-info">
                      <h4>Fee Clearance (No-Dues Certificate)</h4>
                      <p>Official clearance receipt confirming zero outstanding balance for Semester {student.semester}.</p>
                      <span className="ref-badge">Ref: SVSU/ACC/NODUE/2026</span>
                    </div>
                    <button className="letter-download-btn" onClick={() => handleDownloadReceipt(feeTransactions[0])}>
                      <span>⬇</span> Download Certificate
                    </button>
                  </div>

                  {/* Semester Marksheet / Grade Card */}
                  <div className="letter-item-card">
                    <div className="letter-icon">📑</div>
                    <div className="letter-info">
                      <h4>Provisional Semester Marksheet</h4>
                      <p>Full grade transcript showing internal, external, and total grade points for Semester 4.</p>
                      <span className="ref-badge">Ref: SVSU/COE/MARKS/2026</span>
                    </div>
                    <button className="letter-download-btn" onClick={handleDownloadResult}>
                      <span>⬇</span> Download Marksheet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              4. FEES DETAIL TAB
          ======================================================== */}
          {activeTab === 'fees' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Fees & Financial Transaction History</h2>
                  <p>Semester fee structure, payment ledger, and downloadable transaction receipts</p>
                </div>
                <button
                  className="header-action-btn"
                  onClick={() => handleDownloadReceipt(feeTransactions[0])}
                >
                  <span>🧾</span> Download Latest Receipt
                </button>
              </div>

              {/* Fee Financial Summary Cards */}
              <div className="fee-summary-row">
                <div className="fee-metric-card">
                  <span className="metric-label">Total Program Fee Paid</span>
                  <div className="metric-val">₹ 3,20,000</div>
                  <span className="metric-sub">Across 5 Semesters</span>
                </div>

                <div className="fee-metric-card">
                  <span className="metric-label">Current Semester Fee</span>
                  <div className="metric-val">₹ 62,500</div>
                  <span className="metric-sub">Semester {student.semester}</span>
                </div>

                <div className="fee-metric-card success-card">
                  <span className="metric-label">Outstanding Balance</span>
                  <div className="metric-val text-green">₹ 0.00</div>
                  <span className="metric-sub text-green">✔ Status: Fully Cleared (No Dues)</span>
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="fee-ledger-container">
                <div className="table-header-flex">
                  <h3>Payment Transactions & Receipts</h3>
                  <span className="records-count">{feeTransactions.length} Verified Records</span>
                </div>

                <div className="responsive-table-wrapper">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Receipt No</th>
                        <th>Payment Date</th>
                        <th>Semester</th>
                        <th>Fee Particulars</th>
                        <th>Amount (INR)</th>
                        <th>Payment Mode</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeTransactions.map((tx, idx) => (
                        <tr key={idx}>
                          <td className="receipt-cell">
                            <strong>{tx.receiptNo}</strong>
                          </td>
                          <td>{tx.date}</td>
                          <td><span className="sem-pill">{tx.semester}</span></td>
                          <td>{tx.purpose}</td>
                          <td className="amount-cell">₹ {tx.amount.toLocaleString('en-IN')}.00</td>
                          <td>{tx.mode}</td>
                          <td>
                            <span className="status-pill cleared">
                              ✔ {tx.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-download-receipt"
                              onClick={() => handleDownloadReceipt(tx)}
                              title="Download official receipt PDF"
                            >
                              <span>🧾</span> Download Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              5. ATTENDANCE TAB
          ======================================================== */}
          {activeTab === 'attendance' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Attendance Tracker & Subject Breakdown</h2>
                  <p>Semester 5 daily lecture and laboratory attendance records</p>
                </div>
              </div>

              {/* Attendance Highlights Bar */}
              <div className="attendance-hero-card">
                <div className="att-gauge-box">
                  <div className="att-gauge-circle">
                    <span className="gauge-number">{student.attendance || 88.5}%</span>
                    <span className="gauge-label">Overall</span>
                  </div>
                </div>
                <div className="att-info-box">
                  <h3>Attendance Eligibility Status: <strong>SAFE & ELIGIBLE</strong></h3>
                  <p>
                    As per University Examination Ordinance Clause 14.2, students must maintain a minimum of <strong>75% attendance</strong> to be eligible to sit for end-semester examinations.
                  </p>
                  <div className="att-stats-summary">
                    <div className="stat-pill">Total Lectures Held: <strong>242</strong></div>
                    <div className="stat-pill">Lectures Attended: <strong>219</strong></div>
                    <div className="stat-pill">Authorized Medical Leave: <strong>3 Days</strong></div>
                  </div>
                </div>
              </div>

              {/* Subject-wise Attendance Table */}
              <div className="subject-att-table-card">
                <h3>Subject-wise Attendance Breakdown</h3>
                <div className="responsive-table-wrapper">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>Subject Description</th>
                        <th>Course Faculty</th>
                        <th style={{ textAlign: 'center' }}>Total Held</th>
                        <th style={{ textAlign: 'center' }}>Attended</th>
                        <th style={{ textAlign: 'center' }}>Percentage</th>
                        <th>Eligibility Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectsAttendance.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="code-cell">{sub.code}</td>
                          <td><strong>{sub.name}</strong></td>
                          <td className="text-muted">{sub.teacher}</td>
                          <td style={{ textAlign: 'center' }}>{sub.total}</td>
                          <td style={{ textAlign: 'center' }}>{sub.attended}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="percent-bar-wrapper">
                              <span className="pct-num">{sub.percentage}%</span>
                              <div className="mini-track">
                                <div
                                  className={`mini-fill ${sub.percentage >= 85 ? 'high' : sub.percentage >= 75 ? 'med' : 'low'}`}
                                  style={{ width: `${sub.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {sub.percentage >= 75 ? (
                              <span className="status-pill safe">✔ Eligible</span>
                            ) : (
                              <span className="status-pill warning">⚠ Shortage</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              6. EXAMINATION TAB
          ======================================================== */}
          {activeTab === 'examination' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Examination Schedule & Admit Card</h2>
                  <p>Odd Semester Regular Examination 2026-27 Hall Tickets</p>
                </div>
                <button className="header-action-btn primary" onClick={handleDownloadAdmit}>
                  <span>🎫</span> Download Admit Card (PDF)
                </button>
              </div>

              {/* Admit Card Banner Notification */}
              <div className="admit-card-prompt-banner">
                <div className="prompt-icon">🎫</div>
                <div className="prompt-text">
                  <h3>End-Semester Examination Admit Card is Available for Download!</h3>
                  <p>
                    All students must download and print their Admit Card and present it along with the University Student ID Card at Examination Hall B-204 / A-102.
                  </p>
                </div>
                <button className="cta-download-admit-btn" onClick={handleDownloadAdmit}>
                  <span>⬇</span> Download Hall Ticket
                </button>
              </div>

              {/* Schedule Table */}
              <div className="exam-schedule-card">
                <div className="table-header-flex">
                  <div>
                    <h3>Date Sheet / Exam Timetable</h3>
                    <p>Roll No: <strong>{student.rollNo}</strong> • Center: <strong>FET Main Block Examination Center</strong></p>
                  </div>
                  <button className="secondary-action-btn" onClick={handleDownloadAdmit}>
                    <span>🖨</span> Print Full Date Sheet
                  </button>
                </div>

                <div className="responsive-table-wrapper">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Exam Date</th>
                        <th>Timing</th>
                        <th>Subject Code</th>
                        <th>Subject Title</th>
                        <th>Assigned Hall</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examSchedule.map((exam, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td><strong className="date-strong">{exam.date}</strong></td>
                          <td>{exam.time}</td>
                          <td className="code-cell">{exam.subjectCode}</td>
                          <td><strong>{exam.subjectName}</strong></td>
                          <td>{exam.room}</td>
                          <td>
                            <span className="status-pill upcoming">Upcoming</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exam Rules Card */}
              <div className="exam-rules-card">
                <h4>Mandatory Examination Guidelines</h4>
                <ul>
                  <li>1. Reporting time is 30 minutes prior to exam commencement (09:30 AM).</li>
                  <li>2. Possession of mobile phones, smartwatches, notes, or bags inside the examination hall is strictly prohibited under UFM rules.</li>
                  <li>3. Students must produce their original <strong>University ID Card</strong> along with this <strong>Admit Card</strong> for physical verification.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================
              7. RESULTS TAB
          ======================================================== */}
          {activeTab === 'results' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>Academic Results & Semester Marksheet</h2>
                  <p>Official provisional statement of marks, grades, SGPA, and cumulative CGPA</p>
                </div>
                <button className="header-action-btn" onClick={handleDownloadResult}>
                  <span>📑</span> Download Marksheet PDF
                </button>
              </div>

              {/* Semester Switcher Tabs */}
              <div className="semester-selector-bar">
                <span className="sel-label">Select Semester:</span>
                {resultsList.map((res, idx) => (
                  <button
                    key={idx}
                    className={`sem-select-pill ${selectedResultSemester === res.semester ? 'active' : ''}`}
                    onClick={() => setSelectedResultSemester(res.semester)}
                  >
                    {res.semester}
                  </button>
                ))}
              </div>

              {/* Result Summary Bar */}
              <div className="result-kpi-banner">
                <div className="res-kpi-item">
                  <span className="res-kpi-label">Semester SGPA</span>
                  <div className="res-kpi-value">{activeResult.sgpa} <span className="scale">/ 10</span></div>
                </div>

                <div className="res-kpi-item">
                  <span className="res-kpi-label">Cumulative CGPA</span>
                  <div className="res-kpi-value gold-text">{student.cgpa || 8.64}</div>
                </div>

                <div className="res-kpi-item">
                  <span className="res-kpi-label">Total Credits Earned</span>
                  <div className="res-kpi-value">{activeResult.totalCredits}</div>
                </div>

                <div className="res-kpi-item result-status-col">
                  <span className="res-kpi-label">Final Evaluation</span>
                  <div className="res-status-badge">{activeResult.status}</div>
                </div>
              </div>

              {/* Marksheet Subject Table */}
              <div className="marksheet-card">
                <div className="table-header-flex">
                  <div>
                    <h3>{activeResult.semester} Statement of Marks</h3>
                    <p>Examination Session: <strong>{activeResult.examSession}</strong></p>
                  </div>
                  <button className="secondary-action-btn" onClick={handleDownloadResult}>
                    <span>⬇</span> Download {activeResult.semester} Marksheet
                  </button>
                </div>

                <div className="responsive-table-wrapper">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subject Code</th>
                        <th>Subject Title</th>
                        <th style={{ textAlign: 'center' }}>Credits</th>
                        <th style={{ textAlign: 'center' }}>Internal (30)</th>
                        <th style={{ textAlign: 'center' }}>External (70)</th>
                        <th style={{ textAlign: 'center' }}>Total (100)</th>
                        <th style={{ textAlign: 'center' }}>Grade</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeResult.subjects.map((sub, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="code-cell">{sub.code}</td>
                          <td><strong>{sub.name}</strong></td>
                          <td style={{ textAlign: 'center' }}>{sub.credits}</td>
                          <td style={{ textAlign: 'center' }}>{sub.internal}</td>
                          <td style={{ textAlign: 'center' }}>{sub.external}</td>
                          <td style={{ textAlign: 'center' }} className="amount-cell">
                            {sub.total}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="grade-badge">{sub.grade}</span>
                          </td>
                          <td>
                            <span className="status-pill safe">Passed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              8. LETTERS & NOTICES TAB
          ======================================================== */}
          {activeTab === 'notices' && (
            <div className="tab-view-container animate-fade">
              <div className="section-header-bar">
                <div>
                  <h2>University Circulars & Official Notice Letters</h2>
                  <p>Official communication letters published by Swami Vivekanand Subharti University</p>
                </div>
              </div>

              <div className="notices-archive-grid">
                {noticesList.map((notice, idx) => (
                  <div key={idx} className="notice-full-card">
                    <div className="notice-top-meta">
                      <span className="notice-cat-chip">{notice.category}</span>
                      <span className="notice-date-stamp">📅 {notice.date}</span>
                    </div>

                    <h3 className="notice-main-title">{notice.title}</h3>
                    <span className="notice-ref-num">Ref Code: <strong>{notice.refNo}</strong></span>

                    <p className="notice-body-snippet">{notice.description}</p>

                    <div className="notice-sign-meta">
                      <span>Authority:</span> <strong>{notice.signatory}</strong>
                    </div>

                    <div className="notice-actions-row">
                      <button
                        className="btn-view-notice"
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <span>👁</span> View Full Notice Letter
                      </button>
                      <button
                        className="btn-download-notice"
                        onClick={() => handleDownloadNoticeLetter(notice)}
                      >
                        <span>⬇</span> Download Official Letter (PDF)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: View Official Notice Letter */}
      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="modal-box notice-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-brand-header">
                <h3>SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h3>
                <p>Official Letterhead • {selectedNotice.category}</p>
              </div>
              <button className="modal-close" onClick={() => setSelectedNotice(null)}>&times;</button>
            </div>

            <div className="notice-modal-body">
              <div className="ref-date-row">
                <span>Ref: <strong>{selectedNotice.refNo}</strong></span>
                <span>Date: <strong>{selectedNotice.date}</strong></span>
              </div>

              <h2 className="modal-notice-title">{selectedNotice.title}</h2>

              <div className="modal-notice-text">
                <p>{selectedNotice.description}</p>
                <p style={{ marginTop: '14px' }}>
                  All concerned students, faculty members, and departments are requested to take note of the above instruction and comply accordingly.
                </p>
              </div>

              <div className="modal-notice-signatory">
                <span>By Order of Competent Authority:</span>
                <strong>{selectedNotice.signatory}</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedNotice(null)}>
                Close
              </button>
              <button
                className="btn-download-notice primary"
                onClick={() => {
                  handleDownloadNoticeLetter(selectedNotice);
                }}
              >
                <span>🖨</span> Download / Print Official Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
