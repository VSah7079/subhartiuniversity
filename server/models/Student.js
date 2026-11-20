const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    registrationNo: {
      type: String,
      trim: true,
      uppercase: true,
      index: true
    },
    dob: {
      type: String,
      required: true, // DDMMYYYY format
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      trim: true
    },
    motherName: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      default: 'Male'
    },
    bloodGroup: {
      type: String,
      default: 'B+'
    },
    category: {
      type: String,
      default: 'General'
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    guardianPhone: {
      type: String,
      default: '+91 98123 45678'
    },
    address: {
      type: String,
      default: 'Subhartipuram Campus Hostel Block-A, Meerut, UP - 250005'
    },
    course: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      default: 'Computer Science & Engineering'
    },
    semester: {
      type: Number,
      required: true,
      default: 5
    },
    department: {
      type: String,
      default: 'Faculty of Engineering & Technology'
    },
    academicYear: {
      type: String,
      default: '2023 - 2027'
    },
    batch: {
      type: String,
      default: '2023'
    },
    admissionDate: {
      type: String,
      default: '12 August 2023'
    },
    mentorName: {
      type: String,
      default: 'Dr. RK Sharma (Professor & Head, CSE)'
    },
    attendance: {
      type: Number,
      default: 88.5
    },
    cgpa: {
      type: Number,
      default: 8.64
    },
    feeStatus: {
      type: String,
      enum: ['Cleared', 'Pending', 'Partial', 'Due', 'Overdue'],
      default: 'Cleared'
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Alumni'],
      default: 'Active'
    },
    subjectsAttendance: {
      type: Array,
      default: []
    },
    feeTransactions: {
      type: Array,
      default: []
    },
    examSchedule: {
      type: Array,
      default: []
    },
    results: {
      type: Array,
      default: []
    },
    notices: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);
