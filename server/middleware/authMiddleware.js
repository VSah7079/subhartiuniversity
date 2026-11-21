const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const { getDbStatus, getMockStudents } = require('../config/db');

const escapeRegex = (str) => (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access token missing or invalid.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'svsu_super_secure_jwt_secret_key_2026_university_erp');

    if (getDbStatus()) {
      let student = null;
      if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          student = await Student.findById(decoded.id).select('-__v');
        } catch (_) {}
      }
      if (!student && decoded.enrollmentNo) {
        student = await Student.findOne({
          $or: [
            { enrollmentNo: new RegExp(`^${escapeRegex(decoded.enrollmentNo)}$`, 'i') },
            { studentId: new RegExp(`^${escapeRegex(decoded.enrollmentNo)}$`, 'i') }
          ]
        }).select('-__v');
      }

      if (!student) {
        return res.status(401).json({ success: false, message: 'Student record not found.' });
      }
      req.student = student;
    } else {
      // Mock mode verification
      const mockList = getMockStudents();
      const student = mockList.find(s => s._id === decoded.id || s.enrollmentNo === decoded.enrollmentNo);
      if (!student) {
        return res.status(401).json({ success: false, message: 'Student record not found in session.' });
      }
      req.student = student;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or session expired. Please sign in again.'
    });
  }
};

module.exports = { protect };
