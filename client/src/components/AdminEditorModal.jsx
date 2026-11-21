import React, { useState, useEffect, useRef } from 'react';
import { downloadMarksheet } from '../utils/documentGenerator';

export const DEFAULT_FOUR_YEAR_RESULTS = [
  {
    semester: 'Year 1',
    examSession: 'June 2017',
    marks: '450/600',
    percentage: '75.00%',
    sgpa: '450/600',
    totalCredits: 20,
    status: 'PASSED FIRST DIVISION',
    subjects: [
      { code: 'MBBS-1', name: 'ANATOMY', credits: 4, internal: 27, external: 60, total: 87, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-2', name: 'PHYSIOLOGY', credits: 4, internal: 25, external: 60, total: 85, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-3', name: 'BIOCHEMISTRY', credits: 4, internal: 26, external: 61, total: 87, grade: 'A+', remarks: 'Passed' }
    ]
  },
  {
    semester: 'Year 2',
    examSession: 'June 2018',
    marks: '540/700',
    percentage: '77.14%',
    sgpa: '540/700',
    totalCredits: 22,
    status: 'PASSED FIRST DIVISION',
    subjects: [
      { code: 'MBBS-1', name: 'PHARMACOLOGY', credits: 4, internal: 26, external: 62, total: 88, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-2', name: 'MICROBIOLOGY', credits: 4, internal: 25, external: 60, total: 85, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-3', name: 'PATHOLOGY', credits: 4, internal: 28, external: 64, total: 92, grade: 'O', remarks: 'Passed' },
      { code: 'MBBS-4', name: 'FMT', credits: 4, internal: 27, external: 61, total: 88, grade: 'A+', remarks: 'Passed' }
    ]
  },
  {
    semester: 'Year 3',
    examSession: 'Dec 2019',
    marks: '520/700',
    percentage: '74.28%',
    sgpa: '520/700',
    totalCredits: 22,
    status: 'PASSED FIRST DIVISION',
    subjects: [
      { code: 'MBBS-1', name: 'ENT', credits: 4, internal: 27, external: 60, total: 87, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-2', name: 'OPHTHALMOLOGY', credits: 4, internal: 26, external: 59, total: 85, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-3', name: 'SPM', credits: 4, internal: 25, external: 61, total: 86, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-4', name: 'OPD CLINICAL', credits: 4, internal: 28, external: 63, total: 91, grade: 'O', remarks: 'Passed' }
    ]
  },
  {
    semester: 'Year 4',
    examSession: 'Dec 2020',
    marks: '550/700',
    percentage: '78.57%',
    sgpa: '550/700',
    totalCredits: 24,
    status: 'PASSED WITH DISTINCTION',
    subjects: [
      { code: 'MBBS-1', name: 'MEDICINE', credits: 4, internal: 28, external: 64, total: 92, grade: 'O', remarks: 'Passed' },
      { code: 'MBBS-2', name: 'SURGERY', credits: 4, internal: 27, external: 62, total: 89, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-3', name: 'OBS/GYN', credits: 4, internal: 26, external: 60, total: 86, grade: 'A+', remarks: 'Passed' },
      { code: 'MBBS-4', name: 'PEDIATRICS', credits: 4, internal: 28, external: 63, total: 91, grade: 'O', remarks: 'Passed' }
    ]
  }
];

export function normalizeResultsForFourYears(results = []) {
  return ['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((yr, idx) => {
    const existing = (results || []).find((r) => {
      const s = String(r.semester || '').toLowerCase();
      return s.includes(yr.toLowerCase()) || s.includes(`semester ${idx + 1}`) || s === `semester ${idx + 1}` || s.includes(`sem ${idx + 1}`);
    });
    if (existing) {
      const hasSubjects = existing.subjects && existing.subjects.length > 0;
      const isCseDummy = hasSubjects && existing.subjects[0].code && existing.subjects[0].code.startsWith('CSE');
      return {
        ...DEFAULT_FOUR_YEAR_RESULTS[idx],
        ...existing,
        semester: yr,
        isPublished: existing.isPublished !== undefined ? existing.isPublished : true,
        marks: existing.marks || existing.sgpa || (hasSubjects ? DEFAULT_FOUR_YEAR_RESULTS[idx].marks : ''),
        percentage: existing.percentage || (hasSubjects ? DEFAULT_FOUR_YEAR_RESULTS[idx].percentage : ''),
        subjects: isCseDummy ? DEFAULT_FOUR_YEAR_RESULTS[idx].subjects : (hasSubjects ? existing.subjects : [])
      };
    }
    // Brand new unpublished year
    return {
      semester: yr,
      examSession: idx === 0 ? 'June 2017' : idx === 1 ? 'June 2018' : idx === 2 ? 'Dec 2019' : 'Dec 2020',
      marksObtained: '',
      totalMarks: '',
      marks: '',
      percentage: '',
      sgpa: '',
      totalCredits: 20,
      status: 'PASSED FIRST DIVISION',
      isPublished: false,
      subjects: []
    };
  });
}

const withNormalizedResults = (studentObj) => {
  if (!studentObj) return studentObj;
  const copy = JSON.parse(JSON.stringify(studentObj));
  copy.results = normalizeResultsForFourYears(copy.results);
  return copy;
};

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
  const [selectedResultYearIndex, setSelectedResultYearIndex] = useState(0);
  const [formData, setFormData] = useState(() => {
    return withNormalizedResults(
      currentStudent
        ? JSON.parse(JSON.stringify(currentStudent))
        : JSON.parse(JSON.stringify(DEFAULT_STUDENT_TEMPLATE))
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const nativeDatePickerRef = useRef(null);

  // Load students and sync when modal opens or currentStudent changes
  useEffect(() => {
    if (isOpen) {
      if (currentStudent) {
        setFormData(withNormalizedResults(currentStudent));
        setSelectedEnrollment(currentStudent.enrollmentNo);
      }
      fetchStudents();
    }
  }, [isOpen, currentStudent]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const adminToken = sessionStorage.getItem('svsu_admin_token') || '';
      const adminKey = sessionStorage.getItem('svsu_admin_key') || 'admin@svsu2026';

      const res = await fetch('/api/admin/students', {
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          'x-admin-key': adminKey
        }
      });
      const data = await res.json();
      if (data.success && data.students && data.students.length > 0) {
        setStudentList(data.students);
        // If current student exists, select it, else select first
        const activeEnr = currentStudent ? currentStudent.enrollmentNo : data.students[0].enrollmentNo;
        setSelectedEnrollment(activeEnr);
        const activeStudent = data.students.find(
          (s) => s.enrollmentNo.toLowerCase() === activeEnr.toLowerCase()
        ) || data.students[0];
        setFormData(withNormalizedResults(activeStudent));
      } else if (currentStudent) {
        setFormData(withNormalizedResults(currentStudent));
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/admin/students, using active student', err);
      if (currentStudent) {
        setFormData(withNormalizedResults(currentStudent));
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
      setFormData(withNormalizedResults(target));
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

  // 4. Results & Marks (Supports 4 Academic Years: Year 1 to Year 4)
  const currentResult = (formData?.results && formData.results[selectedResultYearIndex])
    ? formData.results[selectedResultYearIndex]
    : {
        semester: `Year ${selectedResultYearIndex + 1}`,
        examSession: selectedResultYearIndex === 0 ? 'June 2017' : selectedResultYearIndex === 1 ? 'June 2018' : selectedResultYearIndex === 2 ? 'Dec 2019' : 'Dec 2020',
        marksObtained: '',
        totalMarks: '',
        marks: '',
        percentage: '',
        status: 'PASSED FIRST DIVISION',
        isPublished: false,
        subjects: []
      };

  const togglePublishCurrentYear = () => {
    const results = normalizeResultsForFourYears(formData.results);
    const targetYear = results[selectedResultYearIndex];
    const newStatus = !targetYear.isPublished;
    targetYear.isPublished = newStatus;
    // If turning ON and subjects are empty, load standard template
    if (newStatus && (!targetYear.subjects || targetYear.subjects.length === 0)) {
      targetYear.subjects = JSON.parse(JSON.stringify(DEFAULT_FOUR_YEAR_RESULTS[selectedResultYearIndex].subjects));
      const totalObt = targetYear.subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
      const maxPossible = targetYear.subjects.length * 100;
      targetYear.marksObtained = totalObt;
      targetYear.totalMarks = maxPossible;
      targetYear.marks = `${totalObt}/${maxPossible}`;
      targetYear.percentage = `${((totalObt / maxPossible) * 100).toFixed(2)}%`;
      targetYear.sgpa = `${totalObt}/${maxPossible}`;
    }
    setFormData((prev) => ({ ...prev, results }));
    showToast(
      newStatus
        ? `✔ ${targetYear.semester} Marksheet is now Published and available for Student Download!`
        : `🔒 ${targetYear.semester} Marksheet is now Unpublished (Hidden from student).`,
      newStatus ? 'success' : 'info'
    );
  };

  const loadStandardMbbsSubjects = () => {
    const results = normalizeResultsForFourYears(formData.results);
    const targetYear = results[selectedResultYearIndex];
    targetYear.subjects = JSON.parse(JSON.stringify(DEFAULT_FOUR_YEAR_RESULTS[selectedResultYearIndex].subjects));
    const totalObt = targetYear.subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const maxPossible = targetYear.subjects.length * 100;
    targetYear.marksObtained = totalObt;
    targetYear.totalMarks = maxPossible;
    targetYear.marks = `${totalObt}/${maxPossible}`;
    targetYear.percentage = `${((totalObt / maxPossible) * 100).toFixed(2)}%`;
    targetYear.sgpa = `${totalObt}/${maxPossible}`;
    targetYear.isPublished = true;
    setFormData((prev) => ({ ...prev, results }));
    showToast(`Standard MBBS subjects loaded & published for ${targetYear.semester}!`, 'success');
  };

  const handleResultMetaChange = (field, value) => {
    const results = normalizeResultsForFourYears(formData.results);
    results[selectedResultYearIndex][field] = value;
    if (field === 'marks') {
      results[selectedResultYearIndex].sgpa = value; // compatibility
    }
    setFormData((prev) => ({ ...prev, results }));
  };

  const handleResultSubjectChange = (subIndex, field, value) => {
    const results = normalizeResultsForFourYears(formData.results);
    const targetYear = results[selectedResultYearIndex];
    if (!targetYear || !targetYear.subjects || !targetYear.subjects[subIndex]) return;
    const subjects = [...targetYear.subjects];
    subjects[subIndex] = { ...subjects[subIndex], [field]: value };
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
    results[selectedResultYearIndex].subjects = subjects;
    // Auto calculate year total marks and marks obtained
    const totalObt = subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const maxPossible = subjects.length * 100;
    if (maxPossible > 0) {
      targetYear.marksObtained = totalObt;
      targetYear.totalMarks = maxPossible;
      targetYear.marks = `${totalObt}/${maxPossible}`;
      targetYear.percentage = `${((totalObt / maxPossible) * 100).toFixed(2)}%`;
      targetYear.sgpa = `${totalObt}/${maxPossible}`;
    }
    setFormData((prev) => ({ ...prev, results }));
  };

  const addResultSubject = () => {
    const results = normalizeResultsForFourYears(formData.results);
    const targetYear = results[selectedResultYearIndex];
    if (!targetYear.subjects) targetYear.subjects = [];
    targetYear.subjects.push({
      code: `MBBS-${targetYear.subjects.length + 1}`,
      name: 'CLINICAL PRACTICAL / ELECTIVE',
      maxMarks: 100,
      internal: 25,
      external: 60,
      total: 85,
      grade: 'A+',
      credits: 4,
      remarks: 'Passed'
    });
    const totalObt = targetYear.subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const maxPossible = targetYear.subjects.length * 100;
    targetYear.marksObtained = totalObt;
    targetYear.totalMarks = maxPossible;
    targetYear.marks = `${totalObt}/${maxPossible}`;
    targetYear.percentage = `${((totalObt / maxPossible) * 100).toFixed(2)}%`;
    targetYear.sgpa = `${totalObt}/${maxPossible}`;
    targetYear.isPublished = true;
    setFormData((prev) => ({ ...prev, results }));
  };

  const removeResultSubject = (subIndex) => {
    const results = normalizeResultsForFourYears(formData.results);
    const targetYear = results[selectedResultYearIndex];
    targetYear.subjects = targetYear.subjects.filter((_, i) => i !== subIndex);
    const totalObt = targetYear.subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const maxPossible = targetYear.subjects.length * 100;
    if (maxPossible > 0) {
      targetYear.marksObtained = totalObt;
      targetYear.totalMarks = maxPossible;
      targetYear.marks = `${totalObt}/${maxPossible}`;
      targetYear.percentage = `${((totalObt / maxPossible) * 100).toFixed(2)}%`;
      targetYear.sgpa = `${totalObt}/${maxPossible}`;
    }
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
      const adminToken = sessionStorage.getItem('svsu_admin_token') || '';
      const adminKey = sessionStorage.getItem('svsu_admin_key') || 'admin@svsu2026';

      const res = await fetch(`/api/admin/student/${enrEncoded}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          'x-admin-key': adminKey
        },
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
            <button
              type="button"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={() => {
                sessionStorage.removeItem('svsu_admin_token');
                sessionStorage.removeItem('svsu_admin_user');
                sessionStorage.removeItem('svsu_admin_key');
                showToast('Administrator logged out. Editor locked.', 'info');
                onClose();
              }}
              title="Sign out of Admin Session and lock editor"
            >
              🔒 Lock & Sign Out
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
            <div>
              {/* Student Passport Photo Upload Box */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '90px', height: '115px', border: '2px solid #0f2137', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Passport Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '32px' }}>👨‍🎓</span>
                      <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>NO PHOTO</span>
                    </>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f2137', fontWeight: 800 }}>Student Passport Photo (ID Card & Marksheet)</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                    Upload official passport photo. It will automatically be printed on the Student ID Card, Examination Marksheets, and Admit Cards.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ background: '#1e3a8a', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📁</span> Choose Photo File (JPG/PNG)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            handleInputChange('photoUrl', ev.target.result);
                            if (showToast) showToast('Photo loaded! Click "Save All Changes" to persist.', 'success');
                          };
                          reader.readAsDataURL(file);
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => handleInputChange('photoUrl', '')}
                        style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🗑️ Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

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

              {/* Upper Summary Cards KPI Controls */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f2137' }}>
                    📊 Uppar Wala Summary Cards (Fee KPI Boxes):
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sum = (formData.feeTransactions || []).reduce((s, c) => s + (Number(c.amount) || 0), 0);
                      const latestFee = (formData.feeTransactions && formData.feeTransactions[0]) ? Number(formData.feeTransactions[0].amount) || 0 : 0;
                      setFormData(prev => ({
                        ...prev,
                        totalFeePaid: sum,
                        currentSemesterFee: latestFee,
                        outstandingBalance: 0,
                        feeStatus: 'Cleared'
                      }));
                      if (showToast) showToast(`Fee synced: Total ₹${sum.toLocaleString('en-IN')}, Current ₹${latestFee.toLocaleString('en-IN')}`);
                    }}
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Auto-Calculate from Transactions (₹ {(formData.feeTransactions || []).reduce((s, c) => s + (Number(c.amount) || 0), 0).toLocaleString('en-IN')})
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Total Program Fee Paid (₹):
                    </label>
                    <input
                      type="number"
                      value={formData.totalFeePaid ?? ''}
                      onChange={(e) => handleInputChange('totalFeePaid', e.target.value)}
                      placeholder={`Auto: ₹ ${(formData.feeTransactions || []).reduce((s, c) => s + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}`}
                      className="admin-text-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Current Semester Fee (₹):
                    </label>
                    <input
                      type="number"
                      value={formData.currentSemesterFee ?? ''}
                      onChange={(e) => handleInputChange('currentSemesterFee', e.target.value)}
                      placeholder="Auto: from current semester receipt"
                      className="admin-text-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Outstanding Balance (₹):
                    </label>
                    <input
                      type="number"
                      value={formData.outstandingBalance ?? ''}
                      onChange={(e) => handleInputChange('outstandingBalance', e.target.value)}
                      placeholder="0.00"
                      className="admin-text-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
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
                  <h4>Year 1 to Year 4 Results & Marksheet Grade Details</h4>
                  <p>Changes will directly update the official printable Semester/Year Grade Marksheets (Year 1 to Year 4)</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => downloadMarksheet(formData, currentResult)}
                    title="Download/Preview this Year's Marksheet"
                  >
                    🖨️ Download {currentResult.semester} Marksheet
                  </button>
                  <button type="button" className="admin-btn-secondary" onClick={addResultSubject}>
                    ➕ Add Subject Result
                  </button>
                </div>
              </div>

              {/* Year Selector Tabs: Year 1, Year 2, Year 3, Year 4 */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#e2e8f0', padding: '6px', borderRadius: '8px', flexWrap: 'wrap' }}>
                {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((yr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedResultYearIndex(idx)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: selectedResultYearIndex === idx ? '#0f2137' : 'transparent',
                      color: selectedResultYearIndex === idx ? '#ffffff' : '#334155',
                      boxShadow: selectedResultYearIndex === idx ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    🎓 {yr} Marksheet
                  </button>
                ))}
              </div>

              {/* Publish Status & Quick Actions Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: currentResult.isPublished ? '#f0fdf4' : '#fff7ed',
                border: currentResult.isPublished ? '1.5px solid #86efac' : '1.5px solid #fed7aa',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{currentResult.isPublished ? '✅' : '🔒'}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: currentResult.isPublished ? '#15803d' : '#9a3412' }}>
                      Student Download Status: {currentResult.isPublished ? `PUBLISHED (Student can view & download ${currentResult.semester})` : `UNPUBLISHED (Download locked for Student)`}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                      {currentResult.isPublished
                        ? `The student portal will display these marks and allow downloading the official ${currentResult.semester} marksheet PDF.`
                        : `The student portal will display "Awaiting University Release" and marksheet download will be completely locked.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={togglePublishCurrentYear}
                    style={{
                      padding: '7px 15px',
                      borderRadius: '6px',
                      border: 'none',
                      background: currentResult.isPublished ? '#dc2626' : '#16a34a',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {currentResult.isPublished ? '🔒 Hide / Unpublish for Student' : '✅ Publish Marksheet for Student'}
                  </button>
                  {(!currentResult.subjects || currentResult.subjects.length === 0) && (
                    <button
                      type="button"
                      onClick={loadStandardMbbsSubjects}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '6px',
                        border: '1px solid #1e3a8a',
                        background: '#ffffff',
                        color: '#1e3a8a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      📋 Pre-fill MBBS Template
                    </button>
                  )}
                </div>
              </div>

              {currentResult && (
                <div className="admin-form-grid" style={{ marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                  <div className="form-group">
                    <label>Result Academic Year / Title</label>
                    <input
                      type="text"
                      value={currentResult.semester || `Year ${selectedResultYearIndex + 1}`}
                      onChange={(e) => handleResultMetaChange('semester', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Exam Session</label>
                    <input
                      type="text"
                      value={currentResult.examSession || 'June 2017'}
                      onChange={(e) => handleResultMetaChange('examSession', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Marks Obtained</label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={currentResult.marksObtained !== undefined ? currentResult.marksObtained : (currentResult.marks ? String(currentResult.marks).split('/')[0] : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleResultMetaChange('marksObtained', val);
                        const tot = currentResult.totalMarks || (currentResult.marks && String(currentResult.marks).includes('/') ? String(currentResult.marks).split('/')[1] : '600');
                        handleResultMetaChange('marks', `${val}/${tot}`);
                        if (Number(tot) > 0) {
                          handleResultMetaChange('percentage', `${((Number(val) / Number(tot)) * 100).toFixed(2)}%`);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Marks</label>
                    <input
                      type="number"
                      placeholder="e.g. 600 or 700"
                      value={currentResult.totalMarks !== undefined ? currentResult.totalMarks : (currentResult.marks && String(currentResult.marks).includes('/') ? String(currentResult.marks).split('/')[1] : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleResultMetaChange('totalMarks', val);
                        const obt = currentResult.marksObtained !== undefined ? currentResult.marksObtained : (currentResult.marks ? String(currentResult.marks).split('/')[0] : '450');
                        handleResultMetaChange('marks', `${obt}/${val}`);
                        if (Number(val) > 0) {
                          handleResultMetaChange('percentage', `${((Number(obt) / Number(val)) * 100).toFixed(2)}%`);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Percentage (%)</label>
                    <input
                      type="text"
                      placeholder="e.g. 75.00% or 66.73%"
                      value={currentResult.percentage !== undefined ? currentResult.percentage : ''}
                      onChange={(e) => handleResultMetaChange('percentage', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Division / Status</label>
                    <input
                      type="text"
                      value={currentResult.status || 'PASSED FIRST DIVISION'}
                      onChange={(e) => handleResultMetaChange('status', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(!currentResult.subjects || currentResult.subjects.length === 0) ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#64748b' }}>
                    No subject marks entered for <strong>{currentResult.semester}</strong> yet (Unpublished).
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn-secondary" onClick={loadStandardMbbsSubjects}>
                      📋 Pre-fill Standard MBBS Template
                    </button>
                    <button type="button" className="admin-btn-secondary" onClick={addResultSubject}>
                      ➕ Add Individual Subject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-editor-table">
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>Subject Title</th>
                        <th style={{ width: '80px' }}>Internal (30)</th>
                        <th style={{ width: '80px' }}>External (70)</th>
                        <th style={{ width: '70px' }}>Total (100)</th>
                        <th style={{ width: '70px' }}>Grade</th>
                        <th style={{ width: '70px' }}>Max Marks</th>
                        <th style={{ width: '50px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentResult.subjects.map((sub, idx) => (
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
                              min="10"
                              max="200"
                              value={sub.maxMarks || 100}
                              onChange={(e) => handleResultSubjectChange(idx, 'maxMarks', e.target.value)}
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
              )}
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
