const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentByEnrollment,
  updateStudent,
  createStudent,
  deleteStudent
} = require('../controllers/adminController');

// Admin Student Management Routes
router.get('/students', getAllStudents);
router.get('/student/:enrollmentNo', getStudentByEnrollment);
router.put('/student/:enrollmentNo', updateStudent);
router.post('/student', createStudent);
router.delete('/student/:enrollmentNo', deleteStudent);

module.exports = router;
