const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/adminMiddleware');
const {
  verifyAdminAccess,
  getAllStudents,
  getStudentByEnrollment,
  updateStudent,
  createStudent,
  deleteStudent
} = require('../controllers/adminController');

// 1. Admin Verification Endpoint
router.post('/verify', verifyAdminAccess);

// 2. Admin Student Management Routes (Protected)
router.get('/students', getAllStudents);
router.get('/student/:enrollmentNo', getStudentByEnrollment);
router.put('/student/:enrollmentNo', requireAdminAuth, updateStudent);
router.post('/student', requireAdminAuth, createStudent);
router.delete('/student/:enrollmentNo', requireAdminAuth, deleteStudent);

module.exports = router;
