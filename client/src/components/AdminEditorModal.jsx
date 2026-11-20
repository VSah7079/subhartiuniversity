import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_STUDENT_TEMPLATE = {
  enrollmentNo: 'SVSU/2023/10892',
  studentId: 'STU984321',
  rollNo: '230910245',
  registrationNo: 'REG-2023-876',
  dob: '15082002',
  fullName: 'Aarav Sharma',
  fatherName: 'Rajesh Sharma',
  motherName: 'Sunita Sharma',
  gender: 'Male',
  bloodGroup: 'B+',
  category: 'General',
  phone: '+91 98765 43210',
  guardianPhone: '+91 98123 45678',
  address: 'Subhartipuram Campus Hostel Block-A, Meerut, UP - 250005',
  course: 'B.Tech - Computer Science & Engineering',
  branch: 'Computer Science & Engineering',
  semester: 5,
  department: 'Faculty of Engineering & Technology',
  academicYear: '2023 - 2027',
  batch: '2023',
  admissionDate: '12 August 2023',
  mentorName: 'Dr. RK Sharma (Professor & Head, CSE)',
  attendance: 88.5,
  cgpa: 8.64,
  feeStatus: 'Cleared',
  email: 'aarav.sharma@subharti.org',
  subjectsAttendance: [
    { code: 'CSE-501', name: 'Database Management Systems', total: 42, attended: 39, percentage: 92.8, teacher: 'Dr. Amit Vashistha' },
    { code: 'CSE-502', name: 'Design & Analysis of Algorithms', total: 40, attended: 35, percentage: 87.5, teacher: 'Prof. Neha Gupta' },
    { code: 'CSE-503', name: 'Web Technologies & MERN Stack', total: 44, attended: 42, percentage: 95.4, teacher: 'Er. Sachin Tyagi' },
    { code: 'CSE-504', name: 'Operating Systems & Cloud Architecture', total: 38, attended: 32, percentage: 84.2, teacher: 'Dr. Vivek Kumar' },
    { code: 'CSE-505', name: 'Microprocessor & Interfacing', total: 36, attended: 31, percentage: 86.1, teacher: 'Prof. Manoj Sharma' },
    { code: 'CSE-506P', name: 'Database Systems Lab', total: 20, attended: 19, percentage: 95.0, teacher: 'Er. Sachin Tyagi' }
  ],
  feeTransactions: [
    { receiptNo: 'REC/2026/0942', date: '14 July 2026', semester: 'Semester 5', amount: 62500, mode: 'Online Netbanking (HDFC)', status: 'Cleared', purpose: 'Tuition & Development Fee' },
    { receiptNo: 'REC/2026/0128', date: '10 Jan 2026', semester: 'Semester 4', amount: 62500, mode: 'UPI / QR Payment (PhonePe)', status: 'Cleared', purpose: 'Tuition & Examination Fee' },
    { receiptNo: 'REC/2025/0811', date: '22 July 2025', semester: 'Semester 3', amount: 60000, mode: 'Online Netbanking (SBI)', status: 'Cleared', purpose: 'Tuition & Lab Fee' }
  ],
  examSchedule: [
    { date: '02 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-501', subjectName: 'Database Management Systems', room: 'Hall B-204, FET Block', status: 'Upcoming' },
    { date: '05 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-502', subjectName: 'Design & Analysis of Algorithms', room: 'Hall B-204, FET Block', status: 'Upcoming' },
    { date: '08 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-503', subjectName: 'Web Technologies & MERN Stack', room: 'Hall A-102, Main Block', status: 'Upcoming' }
  ],
  results: [
    {
      semester: 'Semester 4',
      examSession: 'June 2026',
      sgpa: 8.75,
      totalCredits: 24,
      status: 'PASSED WITH DISTINCTION',
      subjects: [
        { code: 'CSE-401', name: 'Computer Organization & Architecture', internal: 26, external: 62, total: 88, grade: 'A+', credits: 4 },
        { code: 'CSE-402', name: 'Theory of Computation', internal: 24, external: 58, total: 82, grade: 'A', credits: 4 },
        { code: 'CSE-403', name: 'Object Oriented Programming (Java)', internal: 28, external: 65, total: 93, grade: 'O', credits: 4 }
      ]
    }
  ],
  notices: [
    {
      id: 'notice-1',
      title: 'Odd Semester Regular & Carry-Over Examination Schedule 2026-27',
      refNo: 'SVSU/EXAM/2026/1084',
      date: '18 Nov 2026',
      category: 'Examination',
      description: 'The end-semester examinations for all B.Tech/M.Tech and BCA students are scheduled to begin from 02 December 2026. Hall tickets can now be downloaded from the student ERP.',
      signatory: 'Controller of Examinations, Swami Vivekanand Subharti University'
    }
  ]
};

export default function AdminEditorModal({
  isOpen,
  onClose,
  currentStudent,
  onStudentUpdated,
  showToast
}) {
  // Active Tab: 'profile' | 'academic' | 'fees' | 'attendance' | 'exam' | 'results' | 'notices'
  const [activeTab, setActiveTab] = useState('profile');

  // List of all students available in database/mock
  const [studentList, setStudentList] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(
    currentStudent ? currentStudent.enrollmentNo : 'SVSU/2023/10892'
  );

  // Form State holding the entire student object being edited (guaranteed never null)
  const [formData, setFormData] = useState(() => {
    return currentStudent
      ? JSON.parse(JSON.stringify(currentStudent))
      : JSON.parse(JSON.stringify(DEFAULT_STUDENT_TEMPLATE));
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const nativeDatePickerRef = useRef(null);

  // Load students and sync when modal opens or currentStudent changes
  useEffect(() => {
    if (isOpen) {
      if (currentStudent) {
        setFormData(JSON.parse(JSON.stringify(currentStudent)));
        setSelectedEnrollment(currentStudent.enrollmentNo);
      }
      fetchStudents();
    }
  }, [isOpen, currentStudent]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success && data.students && data.students.length > 0) {
        setStudentList(data.students);
        // If current student exists, select it, else select first
        const activeEnr = currentStudent ? currentStudent.enrollmentNo : data.students[0].enrollmentNo;
        setSelectedEnrollment(activeEnr);
        const activeStudent = data.students.find(
          (s) => s.enrollmentNo.toLowerCase() === activeEnr.toLowerCase()
        ) || data.students[0];
        setFormData(JSON.parse(JSON.stringify(activeStudent)));
      } else if (currentStudent) {
        setFormData(JSON.parse(JSON.stringify(currentStudent)));
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/admin/students, using active student', err);
      if (currentStudent) {
        setFormData(JSON.parse(JSON.stringify(currentStudent)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Switch student in editor
  const handleSelectStudent = (enr) => {
    setSelectedEnrollment(enr);
    const target = studentList.find((s) => s.enrollmentNo === enr);
    if (target) {
      setFormData(JSON.parse(JSON.stringify(target)));
    }
  };

  // Create / Initialize New Student template
  const handleCreateNewStudent = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newStudentTemplate = {
      enrollmentNo: `SVSU/2024/${randomNum}`,
      studentId: `STU${Math.floor(100000 + Math.random() * 900000)}`,
      rollNo: `240910${Math.floor(100 + Math.random() * 900)}`,
      registrationNo: `REG-2024-${Math.floor(100 + Math.random() * 900)}`,
      dob: '01012003',
      fullName: 'New Student Name',
      fatherName: 'Father Name',
      motherName: 'Mother Name',
      gender: 'Male',
      bloodGroup: 'O+',
      category: 'General',
      phone: '+91 98765 00000',
      guardianPhone: '+91 98123 00000',
      address: 'Subhartipuram Campus, NH-58, Meerut - 250005',
      course: 'B.Tech - Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      semester: 1,
      department: 'Faculty of Engineering & Technology',
      academicYear: '2024 - 2028',
      batch: '2024',
      admissionDate: '01 August 2024',
      mentorName: 'Dr. RK Sharma (Professor & Head, CSE)',
      attendance: 85.0,
      cgpa: 8.5,
      feeStatus: 'Cleared',
      email: 'student@subharti.org',
      subjectsAttendance: [
        { code: 'CSE-101', name: 'Programming Fundamentals', total: 30, attended: 27, percentage: 90.0, teacher: 'Dr. Amit Vashistha' },
        { code: 'CSE-102', name: 'Mathematics-I', total: 30, attended: 26, percentage: 86.6, teacher: 'Prof. Neha Gupta' }
      ],
      feeTransactions: [
        { receiptNo: `REC/2026/${Math.floor(1000 + Math.random() * 9000)}`, date: '01 Aug 2024', semester: 'Semester 1', amount: 65000, mode: 'Online Netbanking', status: 'Cleared', purpose: 'Tuition & Admission Fee' }
      ],
      examSchedule: [
        { date: '10 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-101', subjectName: 'Programming Fundamentals', room: 'Hall A-101', status: 'Upcoming' }
      ],
      results: [
        {
          semester: 'Semester 1',
          examSession: 'Dec 2024',
          sgpa: 8.5,
          totalCredits: 20,
          status: 'PASSED FIRST DIVISION',
          subjects: [
            { code: 'CSE-101', name: 'Programming Fundamentals', internal: 27, external: 60, total: 87, grade: 'A+', credits: 4 }
          ]
        }
      ],
      notices: [
        {
          id: 'notice-1',
          title: 'Odd Semester Examination Circular',
          refNo: 'SVSU/EXAM/2026/099',
          date: '18 Nov 2026',
          category: 'Examination',
          description: 'University examination notifications and schedule.',
          signatory: 'Controller of Examinations'
        }
      ]
    };
    setFormData(newStudentTemplate);
    setSelectedEnrollment(newStudentTemplate.enrollmentNo);
    showToast('New student template loaded. Fill details and click Save.', 'info');
  };

  // Basic Text Input Handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // DOB Formatter (DD/MM/YYYY)
  const formatDobDisplay = (rawDob) => {
    if (!rawDob) return '';
    const clean = rawDob.replace(/\D/g, '');
    if (clean.length === 8) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    }
    return rawDob;
  };

  const handleDobInput = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    setFormData((prev) => ({ ...prev, dob: digits }));
  };

  const handleCalendarSelect = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [yyyy, mm, dd] = val.split('-');
      setFormData((prev) => ({ ...prev, dob: `${dd}${mm}${yyyy}` }));
    }
  };

  // ----------------- SUB-ARRAY HANDLERS -----------------

  // 1. Attendance by Subject
  const handleSubjectChange = (index, field, value) => {
    const list = [...(formData.subjectsAttendance || [])];
    list[index][field] = value;
    // Auto calculate percentage if total or attended changes
    if (field === 'attended' || field === 'total') {
      const att = Number(field === 'attended' ? value : list[index].attended) || 0;
      const tot = Number(field === 'total' ? value : list[index].total) || 1;
      list[index].percentage = parseFloat(((att / tot) * 100).toFixed(1));
    }
    setFormData((prev) => ({ ...prev, subjectsAttendance: list }));
  };

  const addSubjectRow = () => {
    const list = [...(formData.subjectsAttendance || [])];
    list.push({
      code: 'CSE-' + Math.floor(500 + Math.random() * 50),
      name: 'New Academic Subject',
      total: 40,
      attended: 36,
      percentage: 90.0,
      teacher: 'Dr. Faculty Member'
    });
    setFormData((prev) => ({ ...prev, subjectsAttendance: list }));
  };

  const removeSubjectRow = (index) => {
    const list = (formData?.subjectsAttendance || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subjectsAttendance: list }));
  };

  // 2. Fees Transactions
  const handleFeeChange = (index, field, value) => {
    const list = [...(formData.feeTransactions || [])];
    list[index][field] = value;
    setFormData((prev) => ({ ...prev, feeTransactions: list }));
  };

  const addFeeRow = () => {
    const list = [...(formData.feeTransactions || [])];
    list.unshift({
      receiptNo: `REC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      date: '20 Nov 2026',
      semester: `Semester ${formData.semester || 5}`,
      amount: 62500,
      mode: 'Online Netbanking (HDFC)',
      status: 'Cleared',
      purpose: 'Tuition & Development Fee'
    });
    setFormData((prev) => ({ ...prev, feeTransactions: list }));
  };

  const removeFeeRow = (index) => {
    const list = (formData?.feeTransactions || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, feeTransactions: list }));
  };

  // 3. Exam Schedule
  const handleExamChange = (index, field, value) => {
    const list = [...(formData.examSchedule || [])];
    list[index][field] = value;
    setFormData((prev) => ({ ...prev, examSchedule: list }));
  };

  const addExamRow = () => {
    const list = [...(formData.examSchedule || [])];
    list.push({
      date: '18 Dec 2026',
      time: '10:00 AM - 01:00 PM',
      subjectCode: 'CSE-506',
      subjectName: 'Artificial Intelligence & Machine Learning',
      room: 'Hall B-204, FET Block',
      status: 'Upcoming'
    });
    setFormData((prev) => ({ ...prev, examSchedule: list }));
  };

  const removeExamRow = (index) => {
    const list = (formData?.examSchedule || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, examSchedule: list }));
  };

  // 4. Results & Marks
  const currentResult = (formData?.results && formData.results.length > 0) ? formData.results[0] : null;

  const handleResultMetaChange = (field, value) => {
    const results = [...(formData.results || [])];
    if (results.length === 0) {
      results.push({
        semester: 'Semester 4',
        examSession: 'June 2026',
        sgpa: 8.5,
        totalCredits: 24,
        status: 'PASSED WITH DISTINCTION',
        subjects: []
      });
    }
    results[0][field] = value;
    setFormData((prev) => ({ ...prev, results }));
  };

  const handleResultSubjectChange = (subIndex, field, value) => {
    const results = [...(formData.results || [])];
    if (!results[0]) return;
    const subjects = [...results[0].subjects];
    subjects[subIndex][field] = value;
    if (field === 'internal' || field === 'external') {
      const inMark = Number(field === 'internal' ? value : subjects[subIndex].internal) || 0;
      const exMark = Number(field === 'external' ? value : subjects[subIndex].external) || 0;
      subjects[subIndex].total = inMark + exMark;
      // Auto grade
      const tot = inMark + exMark;
      let gr = 'C';
      if (tot >= 90) gr = 'O';
      else if (tot >= 80) gr = 'A+';
      else if (tot >= 70) gr = 'A';
      else if (tot >= 60) gr = 'B+';
      else if (tot >= 50) gr = 'B';
      subjects[subIndex].grade = gr;
    }
    results[0].subjects = subjects;
    setFormData((prev) => ({ ...prev, results }));
  };

  const addResultSubject = () => {
    const results = [...(formData.results || [])];
    if (!results[0]) return;
    results[0].subjects.push({
      code: 'CSE-408',
      name: 'Computer Graphics & Visualization',
      internal: 25,
      external: 60,
      total: 85,
      grade: 'A+',
      credits: 4
    });
    setFormData((prev) => ({ ...prev, results }));
  };

  const removeResultSubject = (subIndex) => {
    const results = [...(formData.results || [])];
    if (!results[0]) return;
    results[0].subjects = results[0].subjects.filter((_, i) => i !== subIndex);
    setFormData((prev) => ({ ...prev, results }));
  };

  // 5. Notices
  const handleNoticeChange = (index, field, value) => {
    const list = [...(formData.notices || [])];
    list[index][field] = value;
    setFormData((prev) => ({ ...prev, notices: list }));
  };

  const addNoticeRow = () => {
    const list = [...(formData.notices || [])];
    list.unshift({
      id: `notice-${Date.now()}`,
      title: 'New Internship / Notis Announcement',
      refNo: `SVSU/TPO/2026/${Math.floor(100 + Math.random() * 900)}`,
      date: '20 Nov 2026',
      category: 'Internship',
      description: 'Official university internship notification and guidelines for students.',
      signatory: 'Registrar & TPO Head, Swami Vivekanand Subharti University'
    });
    setFormData((prev) => ({ ...prev, notices: list }));
  };

  const removeNoticeRow = (index) => {
    const list = (formData?.notices || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, notices: list }));
  };

  // ----------------- SAVE TO SERVER & LOCALSTATE -----------------
  const handleSaveAll = async () => {
    if (!formData || !formData.enrollmentNo) {
      showToast('Enrollment Number is required!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const enrEncoded = encodeURIComponent(formData.enrollmentNo);
      const res = await fetch(`/api/admin/student/${enrEncoded}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update student data on server.');
      }

      showToast(`✔ ${formData.fullName} details successfully updated in ERP Database!`, 'success');

      // Update parent App state so current student immediately refreshes in UI & documents
      if (onStudentUpdated) {
        onStudentUpdated(formData);
      }

      // Update local storage
      localStorage.setItem('svsu_student_profile', JSON.stringify(formData));

      // Re-fetch student list
      fetchStudents();
    } catch (err) {
      console.error('Save error:', err);
      // Fallback: update in localStorage & parent even if backend had a network blip
      if (onStudentUpdated) {
        onStudentUpdated(formData);
      }
      localStorage.setItem('svsu_student_profile', JSON.stringify(formData));
      showToast(`✔ Updated locally and in active session! (${err.message})`, 'success');
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) {
    return (
      <div className="modal-overlay">
        <div className="modal-box admin-editor-modal">
          <p style={{ padding: '40px', textAlign: 'center' }}>Loading SVSU ERP Data Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay admin-modal-overlay" onClick={onClose}>
      <div className="modal-box admin-editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="admin-modal-top-bar">
          <div className="admin-modal-title">
            <span className="admin-shield-icon">⚙️</span>
            <div>
              <h3>SVSU ERP Administration & Master Data Editor</h3>
              <p>Edit student details, academic records, fees, attendance, results & documents</p>
            </div>
          </div>
          <div className="admin-header-actions">
            <button
              className="admin-btn-save"
              onClick={handleSaveAll}
              disabled={isSaving}
              title="Save all changes to backend & refresh portal"
            >
              {isSaving ? 'Saving...' : '💾 Save All Changes'}
            </button>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              &times;
            </button>
          </div>
        </div>

        {/* Student Selector Bar */}
        <div className="admin-student-selector-strip">
          <div className="selector-group">
            <label>Select Student to Edit:</label>
            <select
              value={selectedEnrollment}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="admin-select-input"
            >
              {studentList.map((s) => (
                <option key={s.enrollmentNo} value={s.enrollmentNo}>
                  {s.fullName} ({s.enrollmentNo}) - {s.course}
                </option>
              ))}
            </select>
          </div>
          <button className="admin-btn-secondary" onClick={handleCreateNewStudent}>
            ➕ Add New Student
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Personal Profile
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            🎓 Academic & Dept
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            📊 Attendance ({formData.subjectsAttendance ? formData.subjectsAttendance.length : 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            💳 Fees & Receipts ({formData.feeTransactions ? formData.feeTransactions.length : 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
            onClick={() => setActiveTab('exam')}
          >
            📝 Exam Schedule ({formData.examSchedule ? formData.examSchedule.length : 0})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            🏆 Marksheet & Results
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            📢 Internship & Notis ({formData.notices ? formData.notices.length : 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="admin-modal-body">
          {/* TAB 1: PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Full Student Name *</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div className="form-group">
                <label>Enrollment Number *</label>
                <input
                  type="text"
                  value={formData.enrollmentNo || ''}
                  onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                  placeholder="e.g. SVSU/2023/10892"
                />
              </div>

              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="text"
                  value={formData.studentId || ''}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder="e.g. STU984321"
                />
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  value={formData.rollNo || ''}
                  onChange={(e) => handleInputChange('rollNo', e.target.value)}
                  placeholder="e.g. 230910245"
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNo || ''}
                  onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                  placeholder="e.g. REG-2023-876"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth (DD/MM/YYYY) *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={formatDobDisplay(formData.dob)}
                    onChange={handleDobInput}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={nativeDatePickerRef}
                    type="date"
                    onChange={handleCalendarSelect}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                  />
                  <button
                    type="button"
                    className="admin-calendar-btn"
                    onClick={() => nativeDatePickerRef.current && nativeDatePickerRef.current.showPicker && nativeDatePickerRef.current.showPicker()}
                    title="Choose from calendar picker"
                  >
                    📅
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={formData.bloodGroup || 'B+'}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category || 'General'}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="form-group">
                <label>Father's Name</label>
                <input
                  type="text"
                  value={formData.fatherName || ''}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                />
              </div>

              <div className="form-group">
                <label>Mother's Name</label>
                <input
                  type="text"
                  value={formData.motherName || ''}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  placeholder="e.g. Sunita Sharma"
                />
              </div>

              <div className="form-group">
                <label>Student Mobile Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label>Guardian Contact Mobile</label>
                <input
                  type="text"
                  value={formData.guardianPhone || ''}
                  onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                  placeholder="+91 98123 45678"
                />
              </div>

              <div className="form-group">
                <label>Institutional Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@subharti.org"
                />
              </div>

              <div className="form-group full-width">
                <label>Permanent Residential Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Subhartipuram Campus Hostel Block-A, Meerut - 250005"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC & DEPARTMENT */}
          {activeTab === 'academic' && (
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Course / Degree Program *</label>
                <input
                  type="text"
                  value={formData.course || ''}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  placeholder="e.g. B.Tech - Computer Science & Engineering"
                />
              </div>

              <div className="form-group">
                <label>Branch / Specialization</label>
                <input
                  type="text"
                  value={formData.branch || ''}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div className="form-group">
                <label>Current Semester (1-8)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semester || 1}
                  onChange={(e) => handleInputChange('semester', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-group">
                <label>Department / Faculty</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Faculty of Engineering & Technology"
                />
              </div>

              <div className="form-group">
                <label>Batch</label>
                <input
                  type="text"
                  value={formData.batch || ''}
                  onChange={(e) => handleInputChange('batch', e.target.value)}
                  placeholder="2023"
                />
              </div>

              <div className="form-group">
                <label>Academic Year Duration</label>
                <input
                  type="text"
                  value={formData.academicYear || ''}
                  onChange={(e) => handleInputChange('academicYear', e.target.value)}
                  placeholder="2023 - 2027"
                />
              </div>

              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="text"
                  value={formData.admissionDate || ''}
                  onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                  placeholder="12 August 2023"
                />
              </div>

              <div className="form-group">
                <label>Overall Attendance (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.attendance !== undefined ? formData.attendance : 85}
                  onChange={(e) => handleInputChange('attendance', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label>Cumulative CGPA (out of 10) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa !== undefined ? formData.cgpa : 8.5}
                  onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group full-width">
                <label>Faculty Mentor / HOD Name & Title</label>
                <input
                  type="text"
                  value={formData.mentorName || ''}
                  onChange={(e) => handleInputChange('mentorName', e.target.value)}
                  placeholder="Dr. RK Sharma (Professor & Head, CSE)"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="admin-subtable-section">
              <div className="subtable-header">
                <div>
                  <h4>Subject-wise Attendance Breakdown</h4>
                  <p>Changes will update the live attendance bars and threshold badges</p>
                </div>
                <button type="button" className="admin-btn-secondary" onClick={addSubjectRow}>
                  ➕ Add Subject
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-editor-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Title</th>
                      <th style={{ width: '90px' }}>Attended</th>
                      <th style={{ width: '90px' }}>Total</th>
                      <th style={{ width: '90px' }}>%</th>
                      <th>Teacher / Faculty</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.subjectsAttendance || []).map((sub, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={sub.code}
                            onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                            placeholder="e.g. CSE-501"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                            placeholder="Subject Title"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={sub.attended}
                            onChange={(e) => handleSubjectChange(idx, 'attended', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={sub.total}
                            onChange={(e) => handleSubjectChange(idx, 'total', e.target.value)}
                          />
                        </td>
                        <td>
                          <strong>{sub.percentage}%</strong>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={sub.teacher}
                            onChange={(e) => handleSubjectChange(idx, 'teacher', e.target.value)}
                            placeholder="Faculty Name"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => removeSubjectRow(idx)}
                            title="Delete subject"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FEES & RECEIPTS */}
          {activeTab === 'fees' && (
            <div className="admin-subtable-section">
              <div className="subtable-header">
                <div>
                  <h4>Fee Status & Official Payment Receipts</h4>
                  <p>Receipts edited here can be downloaded and printed as official University Receipts</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>Overall Fee Status:</label>
                  <select
                    value={formData.feeStatus || 'Cleared'}
                    onChange={(e) => handleInputChange('feeStatus', e.target.value)}
                    className="admin-select-input"
                  >
                    <option value="Cleared">Cleared (No Dues)</option>
                    <option value="Pending">Pending</option>
                    <option value="Due">Overdue</option>
                  </select>
                  <button type="button" className="admin-btn-secondary" onClick={addFeeRow}>
                    ➕ Add Receipt
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-editor-table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Date</th>
                      <th>Semester</th>
                      <th>Amount (₹)</th>
                      <th>Payment Mode</th>
                      <th>Status</th>
                      <th>Purpose / Head</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.feeTransactions || []).map((fee, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={fee.receiptNo}
                            onChange={(e) => handleFeeChange(idx, 'receiptNo', e.target.value)}
                            placeholder="REC/2026/0942"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={fee.date}
                            onChange={(e) => handleFeeChange(idx, 'date', e.target.value)}
                            placeholder="14 July 2026"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={fee.semester}
                            onChange={(e) => handleFeeChange(idx, 'semester', e.target.value)}
                            placeholder="Semester 5"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={fee.amount}
                            onChange={(e) => handleFeeChange(idx, 'amount', e.target.value)}
                            placeholder="62500"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={fee.mode}
                            onChange={(e) => handleFeeChange(idx, 'mode', e.target.value)}
                            placeholder="Online Netbanking"
                          />
                        </td>
                        <td>
                          <select
                            value={fee.status}
                            onChange={(e) => handleFeeChange(idx, 'status', e.target.value)}
                          >
                            <option value="Cleared">Cleared</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={fee.purpose}
                            onChange={(e) => handleFeeChange(idx, 'purpose', e.target.value)}
                            placeholder="Tuition Fee"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => removeFeeRow(idx)}
                            title="Delete receipt"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: EXAM SCHEDULE & HALL TICKET */}
          {activeTab === 'exam' && (
            <div className="admin-subtable-section">
              <div className="subtable-header">
                <div>
                  <h4>Examination Schedule & Hall Ticket Papers</h4>
                  <p>Edited exam papers will automatically reflect in the downloadable Official Admit Card</p>
                </div>
                <button type="button" className="admin-btn-secondary" onClick={addExamRow}>
                  ➕ Add Exam Paper
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-editor-table">
                  <thead>
                    <tr>
                      <th>Exam Date</th>
                      <th>Time Slot</th>
                      <th>Paper Code</th>
                      <th>Subject Name</th>
                      <th>Assigned Room / Hall</th>
                      <th>Status</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.examSchedule || []).map((ex, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={ex.date}
                            onChange={(e) => handleExamChange(idx, 'date', e.target.value)}
                            placeholder="02 Dec 2026"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={ex.time}
                            onChange={(e) => handleExamChange(idx, 'time', e.target.value)}
                            placeholder="10:00 AM - 01:00 PM"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={ex.subjectCode}
                            onChange={(e) => handleExamChange(idx, 'subjectCode', e.target.value)}
                            placeholder="CSE-501"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={ex.subjectName}
                            onChange={(e) => handleExamChange(idx, 'subjectName', e.target.value)}
                            placeholder="Database Management Systems"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={ex.room}
                            onChange={(e) => handleExamChange(idx, 'room', e.target.value)}
                            placeholder="Hall B-204, FET Block"
                          />
                        </td>
                        <td>
                          <select
                            value={ex.status || 'Upcoming'}
                            onChange={(e) => handleExamChange(idx, 'status', e.target.value)}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => removeExamRow(idx)}
                            title="Delete exam"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: RESULTS & MARKSHEET */}
          {activeTab === 'results' && (
            <div className="admin-subtable-section">
              <div className="subtable-header">
                <div>
                  <h4>Semester Results & Marksheet Grade Details</h4>
                  <p>Changes will directly update the official printable Semester Grade Marksheet</p>
                </div>
                <button type="button" className="admin-btn-secondary" onClick={addResultSubject}>
                  ➕ Add Subject Result
                </button>
              </div>

              {currentResult && (
                <div className="admin-form-grid" style={{ marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                  <div className="form-group">
                    <label>Result Semester Title</label>
                    <input
                      type="text"
                      value={currentResult.semester || 'Semester 4'}
                      onChange={(e) => handleResultMetaChange('semester', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Exam Session</label>
                    <input
                      type="text"
                      value={currentResult.examSession || 'June 2026'}
                      onChange={(e) => handleResultMetaChange('examSession', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester SGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentResult.sgpa || 8.75}
                      onChange={(e) => handleResultMetaChange('sgpa', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Division / Status</label>
                    <input
                      type="text"
                      value={currentResult.status || 'PASSED WITH DISTINCTION'}
                      onChange={(e) => handleResultMetaChange('status', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="table-responsive">
                <table className="admin-editor-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Title</th>
                      <th style={{ width: '80px' }}>Internal (30)</th>
                      <th style={{ width: '80px' }}>External (70)</th>
                      <th style={{ width: '70px' }}>Total</th>
                      <th style={{ width: '70px' }}>Grade</th>
                      <th style={{ width: '70px' }}>Credits</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentResult && currentResult.subjects ? currentResult.subjects : []).map((sub, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={sub.code}
                            onChange={(e) => handleResultSubjectChange(idx, 'code', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleResultSubjectChange(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={sub.internal}
                            onChange={(e) => handleResultSubjectChange(idx, 'internal', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="70"
                            value={sub.external}
                            onChange={(e) => handleResultSubjectChange(idx, 'external', e.target.value)}
                          />
                        </td>
                        <td>
                          <strong>{sub.total}</strong>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={sub.grade}
                            onChange={(e) => handleResultSubjectChange(idx, 'grade', e.target.value)}
                            style={{ textAlign: 'center', fontWeight: 'bold' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sub.credits}
                            onChange={(e) => handleResultSubjectChange(idx, 'credits', e.target.value)}
                            style={{ textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => removeResultSubject(idx)}
                            title="Delete subject mark"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: INTERNSHIP & NOTIS */}
          {activeTab === 'notices' && (
            <div className="admin-subtable-section">
              <div className="subtable-header">
                <div>
                  <h4>University Internship & Notis Board</h4>
                  <p>Manage official internship notifications and university notis circulars</p>
                </div>
                <button type="button" className="admin-btn-secondary" onClick={addNoticeRow}>
                  ➕ Add Internship / Notis
                </button>
              </div>

              <div className="admin-notices-editor-list">
                {(formData.notices || []).map((ntc, idx) => (
                  <div key={idx} className="admin-notice-item-card">
                    <div className="notice-item-top">
                      <input
                        type="text"
                        className="notice-title-input"
                        value={ntc.title}
                        onChange={(e) => handleNoticeChange(idx, 'title', e.target.value)}
                        placeholder="Internship / Notis Title"
                      />
                      <button
                        type="button"
                        className="btn-delete-row"
                        onClick={() => removeNoticeRow(idx)}
                        title="Delete Internship / Notis"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="admin-form-grid" style={{ marginTop: '10px' }}>
                      <div className="form-group">
                        <label>Ref Number</label>
                        <input
                          type="text"
                          value={ntc.refNo}
                          onChange={(e) => handleNoticeChange(idx, 'refNo', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Issue Date</label>
                        <input
                          type="text"
                          value={ntc.date}
                          onChange={(e) => handleNoticeChange(idx, 'date', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          value={ntc.category}
                          onChange={(e) => handleNoticeChange(idx, 'category', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Signatory Authority</label>
                        <input
                          type="text"
                          value={ntc.signatory || ''}
                          onChange={(e) => handleNoticeChange(idx, 'signatory', e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Internship / Notis Body / Description</label>
                        <textarea
                          rows={2}
                          value={ntc.description}
                          onChange={(e) => handleNoticeChange(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <div className="admin-footer-left">
            <span>Editing Student: <strong>{formData.fullName}</strong> ({formData.enrollmentNo})</span>
          </div>
          <div className="admin-footer-right">
            <button className="btn-cancel" onClick={onClose}>
              Close
            </button>
            <button
              className="admin-btn-save"
              onClick={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : '💾 Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
