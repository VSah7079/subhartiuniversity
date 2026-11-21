const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/adminMiddleware');
const {
  adminLogin,
  verifyAdminAccess,
  getAllStudents,
  getStudentByEnrollment,
  updateStudent,
  createStudent,
  deleteStudent
} = require('../controllers/adminController');

// 1. Admin Authentication Endpoints (Username + Password)
router.post('/login', adminLogin);
router.post('/verify', verifyAdminAccess);

// 2. Admin Student Management Routes (STRICTLY ADMIN PROTECTED)
router.get('/students', requireAdminAuth, getAllStudents);
router.get('/student/:enrollmentNo', requireAdminAuth, getStudentByEnrollment);
router.put('/student/:enrollmentNo', requireAdminAuth, updateStudent);
router.post('/student', requireAdminAuth, createStudent);
router.delete('/student/:enrollmentNo', requireAdminAuth, deleteStudent);

module.exports = router;
