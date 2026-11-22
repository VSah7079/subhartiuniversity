const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const STORE_FILE = path.join(DATA_DIR, 'students_store.json');

// Ensure data directory exists on server disk
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('[Storage Notice] Could not create data directory:', e.message);
  }
}

// Function to load student store from server disk
const loadStoreFromDisk = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      if (content && content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('[Storage Error] Could not read students_store.json:', err.message);
  }
  return null;
};

// Function to save student store to server disk (Atomic Permanent Persistence)
const saveStoreToDisk = (list) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage Error] Could not write students_store.json:', err.message);
  }
};

// Rich student data for Subharti ERP Portal
const initialDefaultStudents = [
  {
    enrollmentNo: 'SVSU/2023/10892',
    studentId: 'STU984321',
    rollNo: '230910245',
    registrationNo: 'REG-2023-876',
    dob: '15082002', // 15 Aug 2002
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
    status: 'Active',
    subjectsAttendance: [
      { code: 'CSE-501', name: 'Database Management Systems', total: 42, attended: 39, percentage: 92.8, teacher: 'Dr. Amit Vashistha' },
      { code: 'CSE-502', name: 'Design & Analysis of Algorithms', total: 40, attended: 35, percentage: 87.5, teacher: 'Prof. Neha Gupta' },
      { code: 'CSE-503', name: 'Web Technologies & MERN Stack', total: 44, attended: 42, percentage: 95.4, teacher: 'Er. Sachin Tyagi' },
      { code: 'CSE-504', name: 'Operating Systems & Cloud Architecture', total: 38, attended: 32, percentage: 84.2, teacher: 'Dr. Vivek Kumar' },
      { code: 'CSE-505', name: 'Microprocessor & Interfacing', total: 36, attended: 31, percentage: 86.1, teacher: 'Prof. Manoj Sharma' },
      { code: 'CSE-506P', name: 'Database Systems Lab', total: 20, attended: 19, percentage: 95.0, teacher: 'Er. Sachin Tyagi' },
      { code: 'CSE-507P', name: 'Full Stack Web Development Lab', total: 22, attended: 22, percentage: 100.0, teacher: 'Er. Ritu Singhal' }
    ],
    feeTransactions: [
      { receiptNo: 'REC/2026/0942', date: '14 July 2026', semester: 'Semester 5', amount: 62500, mode: 'Online Netbanking (HDFC)', status: 'Cleared', purpose: 'Tuition & Development Fee' },
      { receiptNo: 'REC/2026/0128', date: '10 Jan 2026', semester: 'Semester 4', amount: 62500, mode: 'UPI / QR Payment (PhonePe)', status: 'Cleared', purpose: 'Tuition & Examination Fee' },
      { receiptNo: 'REC/2025/0811', date: '22 July 2025', semester: 'Semester 3', amount: 60000, mode: 'Online Netbanking (SBI)', status: 'Cleared', purpose: 'Tuition & Lab Fee' },
      { receiptNo: 'REC/2025/0094', date: '12 Jan 2025', semester: 'Semester 2', amount: 60000, mode: 'Demand Draft (PNB)', status: 'Cleared', purpose: 'Tuition Fee' },
      { receiptNo: 'REC/2023/0012', date: '12 Aug 2023', semester: 'Semester 1', amount: 75000, mode: 'Online Netbanking (HDFC)', status: 'Cleared', purpose: 'Admission & 1st Sem Tuition' }
    ],
    examSchedule: [
      { date: '02 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-501', subjectName: 'Database Management Systems', room: 'Hall B-204, FET Block', status: 'Upcoming' },
      { date: '05 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-502', subjectName: 'Design & Analysis of Algorithms', room: 'Hall B-204, FET Block', status: 'Upcoming' },
      { date: '08 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-503', subjectName: 'Web Technologies & MERN Stack', room: 'Hall A-102, Main Block', status: 'Upcoming' },
      { date: '11 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-504', subjectName: 'Operating Systems & Cloud Architecture', room: 'Hall A-102, Main Block', status: 'Upcoming' },
      { date: '15 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'CSE-505', subjectName: 'Microprocessor & Interfacing', room: 'Hall C-301, IT Block', status: 'Upcoming' }
    ],
    results: [
      {
        semester: 'Semester 4',
        examSession: 'June 2026',
        sgpa: 8.75,
        totalCredits: 24,
        status: 'PASSED WITH DISTINCTION',
        subjects: [
          { code: 'CSE-401', name: 'Computer Organization & Architecture', internal: 34, external: 54, total: 88, grade: 'A+', credits: 4 },
          { code: 'CSE-402', name: 'Theory of Computation', internal: 30, external: 52, total: 82, grade: 'A', credits: 4 },
          { code: 'CSE-403', name: 'Object Oriented Programming (Java)', internal: 37, external: 56, total: 93, grade: 'O', credits: 4 },
          { code: 'CSE-404', name: 'Discrete Mathematics', internal: 25, external: 55, total: 80, grade: 'A', credits: 4 },
          { code: 'CSE-405', name: 'Software Engineering', internal: 27, external: 60, total: 87, grade: 'A+', credits: 4 },
          { code: 'CSE-406P', name: 'Java Programming Lab', internal: 38, external: 58, total: 96, grade: 'O', credits: 2 },
          { code: 'CSE-407P', name: 'Software Engineering Project Lab', internal: 36, external: 58, total: 94, grade: 'O', credits: 2 }
        ]
      },
      {
        semester: 'Semester 3',
        examSession: 'Jan 2026',
        sgpa: 8.52,
        totalCredits: 24,
        status: 'PASSED FIRST DIVISION',
        subjects: [
          { code: 'CSE-301', name: 'Data Structures using C++', internal: 34, external: 54, total: 88, grade: 'A+', credits: 4 },
          { code: 'CSE-302', name: 'Digital Logic & Circuit Design', internal: 23, external: 56, total: 79, grade: 'B+', credits: 4 },
          { code: 'CSE-303', name: 'Computer Networks', internal: 25, external: 59, total: 84, grade: 'A', credits: 4 },
          { code: 'CSE-304', name: 'Mathematics-III (Transform Calculus)', internal: 24, external: 54, total: 78, grade: 'B+', credits: 4 },
          { code: 'CSE-305P', name: 'Data Structures Lab', internal: 36, external: 57, total: 93, grade: 'O', credits: 4 },
          { code: 'CSE-306P', name: 'Digital Electronics Lab', internal: 35, external: 55, total: 90, grade: 'O', credits: 4 }
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
      },
      {
        id: 'notice-4',
        title: 'UP State Post-Matric Scholarship Scheme 2026-27 Verification Notice',
        refNo: 'SVSU/SCHOLARSHIP/2026/45',
        date: '28 Oct 2026',
        category: 'Scholarship',
        description: 'All eligible students applying for UP State Scholarship must submit their verified hard-copy documents to the Scholarship Cell before 30th November 2026.',
        signatory: 'Registrar, Swami Vivekanand Subharti University'
      }
    ]
  },
  {
    enrollmentNo: 'SVSU/2023/10893',
    studentId: 'STU984322',
    rollNo: '230910246',
    registrationNo: 'REG-2023-877',
    dob: '22042003', // 22 Apr 2003
    fullName: 'Priya Verma',
    fatherName: 'Sunil Verma',
    motherName: 'Kavita Verma',
    gender: 'Female',
    bloodGroup: 'O+',
    category: 'OBC',
    phone: '+91 97654 32109',
    guardianPhone: '+91 97123 45678',
    address: 'Faculty Girls Hostel Block-C, Subhartipuram, Meerut - 250005',
    course: 'Bachelor of Computer Applications (BCA)',
    branch: 'Computer Applications',
    semester: 3,
    department: 'Subharti Institute of Technology',
    academicYear: '2024 - 2027',
    batch: '2024',
    admissionDate: '15 July 2024',
    mentorName: 'Dr. Monika Saini (Associate Professor)',
    attendance: 92.0,
    cgpa: 9.12,
    feeStatus: 'Cleared',
    email: 'priya.verma@subharti.org',
    status: 'Active',
    subjectsAttendance: [
      { code: 'BCA-301', name: 'Database Management Systems', total: 40, attended: 38, percentage: 95.0, teacher: 'Dr. Rakesh Tyagi' },
      { code: 'BCA-302', name: 'Java Programming', total: 42, attended: 40, percentage: 95.2, teacher: 'Prof. Anjali Sharma' },
      { code: 'BCA-303', name: 'Operating Systems', total: 38, attended: 34, percentage: 89.4, teacher: 'Dr. Amit Vashistha' },
      { code: 'BCA-304', name: 'Computer Architecture', total: 36, attended: 32, percentage: 88.8, teacher: 'Prof. Manoj Kumar' },
      { code: 'BCA-305P', name: 'Java Lab', total: 20, attended: 19, percentage: 95.0, teacher: 'Prof. Anjali Sharma' }
    ],
    feeTransactions: [
      { receiptNo: 'REC/2026/0411', date: '08 July 2026', semester: 'Semester 3', amount: 48000, mode: 'Online UPI', status: 'Cleared', purpose: 'Tuition Fee' },
      { receiptNo: 'REC/2026/0019', date: '15 Jan 2026', semester: 'Semester 2', amount: 48000, mode: 'Netbanking', status: 'Cleared', purpose: 'Tuition & Exam Fee' }
    ],
    examSchedule: [
      { date: '04 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'BCA-301', subjectName: 'Database Management Systems', room: 'Hall B-101', status: 'Upcoming' },
      { date: '07 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'BCA-302', subjectName: 'Java Programming', room: 'Hall B-101', status: 'Upcoming' },
      { date: '10 Dec 2026', time: '10:00 AM - 01:00 PM', subjectCode: 'BCA-303', subjectName: 'Operating Systems', room: 'Hall A-202', status: 'Upcoming' }
    ],
    results: [
      {
        semester: 'Semester 2',
        examSession: 'June 2026',
        sgpa: 9.12,
        totalCredits: 22,
        status: 'PASSED WITH DISTINCTION (TOPPER)',
        subjects: [
          { code: 'BCA-201', name: 'Data Structures using C', internal: 37, external: 58, total: 95, grade: 'O', credits: 4 },
          { code: 'BCA-202', name: 'Digital Electronics', internal: 35, external: 54, total: 89, grade: 'A+', credits: 4 },
          { code: 'BCA-203', name: 'Discrete Mathematics', internal: 36, external: 56, total: 92, grade: 'O', credits: 4 }
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
        description: 'End-semester examinations schedule released for all students.',
        signatory: 'Controller of Examinations, SVSU'
      }
    ]
  }
];

// Initialize mockStudents from server disk if available, otherwise use initial default students
const diskData = loadStoreFromDisk();
let mockStudents = diskData || initialDefaultStudents;
if (!diskData) {
  saveStoreToDisk(mockStudents);
}

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/svsu_erp';
  
  // Guard against placeholder strings
  if (mongoUri.includes('<cluster') || mongoUri.includes('<db_') || mongoUri.includes('<password>')) {
    console.warn('[MongoDB Notice] Placeholder detected in MONGO_URI. Running in Hybrid Disk-Storage Mode.');
    isConnected = false;
    return;
  }

  const isAtlas = mongoUri.startsWith('mongodb+srv://');
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: isAtlas ? 8000 : 3000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed if database is currently empty
    try {
      const Student = require('../models/Student');
      const count = await Student.countDocuments();
      if (count === 0) {
        console.log('[MongoDB] Database is empty. Auto-seeding initial student records from disk store...');
        await Student.insertMany(mockStudents);
        console.log(`[MongoDB] Auto-seeded ${mockStudents.length} students into MongoDB!`);
      } else {
        console.log(`[MongoDB] Verified ${count} student records active in database.`);
        // Sync database records with local disk store for offline resilience
        try {
          const dbStudents = await Student.find({}).lean();
          if (dbStudents && dbStudents.length > 0) {
            mockStudents = dbStudents.map(s => {
              const obj = { ...s };
              delete obj.__v;
              return obj;
            });
            saveStoreToDisk(mockStudents);
          }
        } catch (_) {}
      }
    } catch (seedErr) {
      console.warn('[MongoDB Auto-Seed Notice]', seedErr.message);
    }
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB (${error.message}).`);
    console.warn(`[MongoDB Notice] Server running in Permanent Disk-Storage Mode (saved in server/data/students_store.json). All data persists across restarts!`);
  }
};

const getDbStatus = () => isConnected;
const getMockStudents = () => mockStudents;

const updateMockStudent = (enrollmentNo, updatedData) => {
  const index = mockStudents.findIndex(
    s => s.enrollmentNo.toLowerCase() === enrollmentNo.toLowerCase()
  );
  if (index !== -1) {
    mockStudents[index] = { ...mockStudents[index], ...updatedData };
    saveStoreToDisk(mockStudents);
    return mockStudents[index];
  } else {
    mockStudents.push(updatedData);
    saveStoreToDisk(mockStudents);
    return updatedData;
  }
};

const addMockStudent = (newStudent) => {
  const exists = mockStudents.find(
    s => s.enrollmentNo.toLowerCase() === newStudent.enrollmentNo.toLowerCase()
  );
  if (exists) {
    return updateMockStudent(newStudent.enrollmentNo, newStudent);
  }
  mockStudents.push(newStudent);
  saveStoreToDisk(mockStudents);
  return newStudent;
};

const deleteMockStudent = (enrollmentNo) => {
  const index = mockStudents.findIndex(
    s => s.enrollmentNo.toLowerCase() === enrollmentNo.toLowerCase()
  );
  if (index !== -1) {
    mockStudents.splice(index, 1);
    saveStoreToDisk(mockStudents);
    return true;
  }
  return false;
};

module.exports = {
  connectDB,
  getDbStatus,
  getMockStudents,
  updateMockStudent,
  addMockStudent,
  deleteMockStudent
};
