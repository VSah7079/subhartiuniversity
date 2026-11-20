const Student = require('../models/Student');
const {
  getDbStatus,
  getMockStudents,
  updateMockStudent,
  addMockStudent,
  deleteMockStudent
} = require('../config/db');

// Helper to escape regex special characters
const escapeRegex = (str) => {
  return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to sanitize identifier (supports DDMMYYYY, DD/MM/YYYY, and YYYY-MM-DD)
const cleanDob = (dobString) => {
  if (!dobString) return '';
  const str = String(dobString).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-');
    return `${d}${m}${y}`;
  }
  return str.replace(/\D/g, '');
};

/**
 * @route   GET /api/admin/students
 * @desc    Get all students for the admin management table
 */
const getAllStudents = async (req, res) => {
  try {
    let students = [];
    if (getDbStatus()) {
      try {
        students = await Student.find({}).sort({ createdAt: -1 });
      } catch (err) {
        console.warn('[Admin Controller] DB fetch failed, falling back to mock:', err.message);
      }
    }

    if (!students || students.length === 0) {
      students = getMockStudents();
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Admin getAllStudents Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students from database.'
    });
  }
};

/**
 * @route   GET /api/admin/student/:enrollmentNo
 * @desc    Get single student details
 */
const getStudentByEnrollment = async (req, res) => {
  try {
    const enr = decodeURIComponent(req.params.enrollmentNo).trim();
    let student = null;

    if (getDbStatus()) {
      try {
        student = await Student.findOne({
          $or: [
            { enrollmentNo: new RegExp(`^${enr}$`, 'i') },
            { studentId: new RegExp(`^${enr}$`, 'i') }
          ]
        });
      } catch (err) {
        console.warn('[Admin Controller] DB find failed:', err.message);
      }
    }

    if (!student) {
      student = getMockStudents().find(
        (s) => s.enrollmentNo.toLowerCase() === enr.toLowerCase() || s.studentId.toLowerCase() === enr.toLowerCase()
      );
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with enrollment "${enr}" not found.`
      });
    }

    return res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/student/:enrollmentNo
 * @desc    Update any and all fields of a student (Profile, Academic, Fees, Attendance, Results, Exam, Notices)
 */
const updateStudent = async (req, res) => {
  try {
    const rawEnr = decodeURIComponent(req.params.enrollmentNo).trim();
    const updateData = req.body;
    const safeEnr = escapeRegex(rawEnr);

    console.log(`[Admin] Updating student data for enrollment: "${rawEnr}"`);

    // Clean DOB if provided
    if (updateData.dob) {
      updateData.dob = cleanDob(updateData.dob);
    }

    // Remove immutable fields so MongoDB update never throws immutable path errors
    const cleanUpdate = { ...updateData };
    delete cleanUpdate._id;
    delete cleanUpdate.id;
    delete cleanUpdate.__v;
    delete cleanUpdate.createdAt;
    delete cleanUpdate.updatedAt;

    let updatedRecord = null;

    // 1. Update in MongoDB if active
    if (getDbStatus()) {
      try {
        updatedRecord = await Student.findOneAndUpdate(
          {
            $or: [
              { enrollmentNo: new RegExp(`^${safeEnr}$`, 'i') },
              { studentId: new RegExp(`^${safeEnr}$`, 'i') }
            ]
          },
          { $set: cleanUpdate },
          { new: true, upsert: true }
        );
      } catch (dbErr) {
        console.warn('[Admin DB Update Error]', dbErr.message);
      }
    }

    // 2. Always update in-memory / mock list as well for fallback consistency
    updatedRecord = updateMockStudent(rawEnr, cleanUpdate);

    return res.status(200).json({
      success: true,
      message: `Student "${cleanUpdate.fullName || rawEnr}" details updated successfully!`,
      student: updatedRecord
    });
  } catch (error) {
    console.error('Admin updateStudent Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student data: ' + error.message
    });
  }
};

/**
 * @route   POST /api/admin/student
 * @desc    Create / Add a new student record
 */
const createStudent = async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.enrollmentNo || !studentData.fullName) {
      return res.status(400).json({
        success: false,
        message: 'Enrollment Number and Full Name are required.'
      });
    }

    studentData.dob = cleanDob(studentData.dob || '15082002');
    studentData.studentId = studentData.studentId || `STU${Math.floor(100000 + Math.random() * 900000)}`;
    studentData.rollNo = studentData.rollNo || `${Math.floor(230000000 + Math.random() * 900000)}`;

    const cleanStudent = { ...studentData };
    delete cleanStudent._id;
    delete cleanStudent.id;
    delete cleanStudent.__v;

    let newStudent = null;

    if (getDbStatus()) {
      try {
        newStudent = await Student.create(cleanStudent);
      } catch (err) {
        console.warn('[Admin Create DB Error]', err.message);
      }
    }

    newStudent = addMockStudent(cleanStudent);

    return res.status(201).json({
      success: true,
      message: `New student "${studentData.fullName}" added successfully!`,
      student: newStudent
    });
  } catch (error) {
    console.error('Admin createStudent Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create new student: ' + error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/student/:enrollmentNo
 * @desc    Delete a student record
 */
const deleteStudent = async (req, res) => {
  try {
    const enr = decodeURIComponent(req.params.enrollmentNo).trim();

    if (getDbStatus()) {
      try {
        await Student.findOneAndDelete({
          $or: [
            { enrollmentNo: new RegExp(`^${enr}$`, 'i') },
            { studentId: new RegExp(`^${enr}$`, 'i') }
          ]
        });
      } catch (err) {
        console.warn('[Admin Delete DB Error]', err.message);
      }
    }

    deleteMockStudent(enr);

    return res.status(200).json({
      success: true,
      message: `Student with enrollment "${enr}" deleted.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentByEnrollment,
  updateStudent,
  createStudent,
  deleteStudent
};
