require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const { getMockStudents } = require('./config/db');

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/svsu_erp';
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    await Student.deleteMany({});
    console.log('[Seed] Cleared existing students.');

    const seedStudents = getMockStudents();
    await Student.insertMany(seedStudents);
    console.log(`[Seed] Successfully inserted ${seedStudents.length} comprehensive student records!`);
    console.log('[Seed] Sample credentials:');
    console.log('       1) Enrollment: SVSU/2023/10892 | DOB: 15082002  (Aarav Sharma - B.Tech CSE)');
    console.log('       2) Student ID: STU984322       | DOB: 22042003  (Priya Verma - BCA)');

    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error.message);
    process.exit(1);
  }
};

seedDatabase();
