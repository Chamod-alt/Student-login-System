const express = require('express');
const multer = require('multer');
const { db } = require('../firebase/firebaseConfig');

const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/**
 * POST /api/students
 * Create new student
 */
router.post('/', upload.single('picture'), async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      className,
      contactNumber,
      motherName,
      fatherName
    } = req.body;

    const picturePath = req.file ? req.file.path : null;

    const studentData = {
      studentId,
      studentName,
      className,
      contactNumber,
      motherName,
      fatherName,
      picture: picturePath,
      createdAt: new Date()
    };

    await db.collection('students').add(studentData);

    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(500).json({ error: 'Failed to register student' });
  }
});

/**
 * GET /api/students
 * Fetch all students
 */
router.get('/', async (req, res) => {
  try {
    const studentsSnapshot = await db.collection('students').get();
    const students = [];

    studentsSnapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

/**
 * DELETE /api/students/:id
 * Delete student by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    await db.collection('students').doc(studentId).delete();
    res.status(200).json({ message: 'Student deleted successfully!' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

/**
 * PUT /api/students/:id
 * Update student by ID
 */
router.put('/:id', upload.single('picture'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      studentId: updatedStudentId,
      studentName,
      className,
      contactNumber,
      motherName,
      fatherName
    } = req.body;

    const picturePath = req.file ? req.file.path : null;

    const updatedData = {
      studentId: updatedStudentId,
      studentName,
      className,
      contactNumber,
      motherName,
      fatherName,
    };

    if (picturePath) {
      updatedData.picture = picturePath;
    }

    await db.collection('students').doc(studentId).update(updatedData);

    res.status(200).json({ message: 'Student updated successfully!' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

module.exports = router;


