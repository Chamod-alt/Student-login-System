
const { db, bucket } = require('../firebase/firebaseConfig');
const { v4: uuidv4 } = require('uuid');

const addStudent = async (req, res) => { 
  try {
    const id = uuidv4();
    const data = req.body;

    if (!req.files || !req.files.picture) {
      return res.status(400).send('Picture is required.');
    }

    const picture = req.files.picture;
    const file = bucket.file(`pictures/${id}_${picture.name}`);

    await file.save(picture.data, { contentType: picture.mimetype });
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });

    await db.collection('students').doc(id).set({ ...data, pictureUrl: url });
    res.send({ id, ...data, pictureUrl: url });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStudents = async (req, res) => {
  try {
    const snapshot = await db.collection('students').get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStudentById = async (req, res) => {
  try {
    const doc = await db.collection('students').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send('Student not found');
    res.send({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const data = req.body;
    await db.collection('students').doc(req.params.id).update(data);
    res.send('Student updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteStudent = async (req, res) => {
  try {
    await db.collection('students').doc(req.params.id).delete();
    res.send('Student deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
