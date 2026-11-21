const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { getDbStatus, getMockStudents } = require('../config/db');

// Helper to escape regex special characters
const escapeRegex = (str) => {
  return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to sign JWT token
const signToken = (student) => {
  return jwt.sign(
    {
      id: student._id || student.enrollmentNo,
      enrollmentNo: student.enrollmentNo,
      fullName: student.fullName,
      role: 'student'
    },
    process.env.JWT_SECRET || 'svsu_super_secure_jwt_secret_key_2026_university_erp',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Clean identifier and DOB (supports DDMMYYYY, DD/MM/YYYY, and YYYY-MM-DD)
const cleanDob = (dobString) => {
  if (!dobString) return '';
  const str = String(dobString).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-');
    return `${d}${m}${y}`;
  }
  return str.replace(/\D/g, ''); // Extract only digits
};

/**
 * @route   POST /api/auth/student-login
 * @desc    Authenticate student via Enrollment No / Student ID / Roll No + Date of Birth
 * @access  Public
 */
const studentLogin = async (req, res) => {
  try {
    const { loginOption = 'enrollment', identifier, dob } = req.body;

    const cleanId = (identifier || '').trim();
    const rawDob = cleanDob(dob);

    console.log(`[Auth] Login attempt for ID: "${cleanId}", DOB: "${rawDob}", Option: "${loginOption}"`);

    if (!cleanId) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your Student ID or Enrollment Number.'
      });
    }

    if (!rawDob) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your Date of Birth in DD/MM/YYYY format.'
      });
    }

    if (rawDob.length !== 8) {
      return res.status(400).json({
        success: false,
        message: 'Date of Birth must be 8 digits (DD/MM/YYYY).'
      });
    }

    const safeId = escapeRegex(cleanId);
    let student = null;

    // 1. Try querying MongoDB if connected
    if (getDbStatus()) {
      try {
        student = await Student.findOne({
          $or: [
            { enrollmentNo: new RegExp(`^${safeId}$`, 'i') },
            { studentId: new RegExp(`^${safeId}$`, 'i') },
            { rollNo: new RegExp(`^${safeId}$`, 'i') },
            { registrationNo: new RegExp(`^${safeId}$`, 'i') }
          ]
        });
      } catch (dbErr) {
        console.warn('[Auth DB Query Error]', dbErr.message);
      }
    }

    // 2. Safety Fallback: If not found in MongoDB, check mock list so demo credentials always work
    if (!student) {
      const mockList = getMockStudents();
      student = mockList.find((s) => {
        return (
          s.enrollmentNo.toLowerCase() === cleanId.toLowerCase() ||
          s.studentId.toLowerCase() === cleanId.toLowerCase() ||
          s.rollNo === cleanId ||
          (s.registrationNo && s.registrationNo.toLowerCase() === cleanId.toLowerCase())
        );
      });
    }

    // 3. If student still not found
    if (!student) {
      console.warn(`[Auth 401] No student record found for identifier: "${cleanId}"`);
      return res.status(401).json({
        success: false,
        message: `No student record found with ID "${cleanId}". Available demo ID: SVSU/2023/10892`
      });
    }

    // 4. Verify Date of Birth
    const studentDobClean = cleanDob(student.dob);
    if (studentDobClean !== rawDob) {
      console.warn(`[Auth 401] DOB mismatch for student ${student.enrollmentNo}. Expected "${studentDobClean}", Received "${rawDob}"`);
      return res.status(401).json({
        success: false,
        message: 'Incorrect Date of Birth. Please check DD/MM/YYYY format.'
      });
    }

    console.log(`[Auth 200] Successful authentication for: ${student.fullName} (${student.enrollmentNo})`);

    // Issue JWT Token
    const token = signToken(student);

    // Return full student details strictly from database record
    const studentObj = student.toObject ? student.toObject() : JSON.parse(JSON.stringify(student));
    delete studentObj.password;
    delete studentObj.__v;

    studentObj.id = studentObj._id || studentObj.enrollmentNo;
    studentObj.photoUrl = studentObj.photoUrl || '';
    studentObj.fatherName = studentObj.fatherName || '';
    studentObj.motherName = studentObj.motherName || '';
    studentObj.results = Array.isArray(studentObj.results) ? studentObj.results : [];
    studentObj.feeTransactions = Array.isArray(studentObj.feeTransactions) ? studentObj.feeTransactions : [];
    studentObj.examSchedule = Array.isArray(studentObj.examSchedule) ? studentObj.examSchedule : [];
    studentObj.subjectsAttendance = Array.isArray(studentObj.subjectsAttendance) ? studentObj.subjectsAttendance : [];
    studentObj.notices = Array.isArray(studentObj.notices) ? studentObj.notices : [];

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome to Subharti ERP Portal.',
      token,
      student: studentObj
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while authenticating. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get currently logged-in student profile
 * @access  Private
 */
const getStudentProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      student: req.student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student profile.'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout student
 * @access  Private
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Signed out successfully from Subharti ERP session.'
  });
};

module.exports = {
  studentLogin,
  getStudentProfile,
  logout
};
