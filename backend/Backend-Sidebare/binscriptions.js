const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const logger = require('morgan');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/lenovo/OneDrive/Bureau/projet_1/code_face_recognation/student_images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors()); // Enable CORS for all routes

const mongoURI = 'mongodb://localhost:27017/';
const dbName = 'system_facial';
const stagiaireCollectionName = 'stagiaire';

let db, stagiaireCollection;

MongoClient.connect(mongoURI, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        stagiaireCollection = db.collection(stagiaireCollectionName);
        console.log('Connected to MongoDB');
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.get('/stagiaire', async (req, res) => {
    try {
        const { nom_groub } = req.query;
        let query = {};
        if (nom_groub) {
            query.nom_groub = nom_groub;
        }
        const stagiaireList = await stagiaireCollection.find(query).toArray();
        const formattedStagiaireList = stagiaireList.map(stagiaire => ({
            _id: stagiaire._id.toString(),
            nom: stagiaire.nom,
            prenom: stagiaire.prenom,
            date_naissance: stagiaire.date_naissance,
            genre: stagiaire.genre,
            nom_groub: stagiaire.nom_groub,
            imagePath: stagiaire.imagePath,
        }));
        res.json(formattedStagiaireList);
    } catch (error) {
        const errorMsg = `Error fetching stagiaires: ${error}`;
        console.error(errorMsg);
        res.status(500).json({ error: errorMsg });
    }
});

app.get('/api/groups', async (req, res) => {
    try {
        const groups = await stagiaireCollection.distinct('nom_groub');
        res.json(groups.map(group => ({ nom_groub: group })));
    } catch (error) {
        const errorMsg = `Error fetching groups: ${error}`;
        console.error(errorMsg);
        res.status(500).json({ error: errorMsg });
    }
});

// مسار POST لإضافة طالب جديد مع صورة
app.post('/stagiaire', upload.single('image'), async (req, res) => {
    try {
        const { nom, prenom, date_naissance, genre, nom_groub } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const newStudent = { nom, prenom, date_naissance, genre, nom_groub, imagePath };

        const result = await stagiaireCollection.insertOne(newStudent);
        res.status(201).json({
            _id: result.insertedId.toString(),
            ...newStudent
        });
    } catch (error) {
        const errorMsg = `Error adding student: ${error}`;
        console.error(errorMsg);
        res.status(500).json({ error: errorMsg });
    }
});

// مسار DELETE لحذف طالب باستخدام المعرف
app.delete('/stagiaire/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log('Received request to delete student with ID:', studentId);

        const objectId = new ObjectId(studentId);  // استخدام ObjectId بشكل صحيح
        console.log('Converted ObjectId:', objectId);

        const result = await stagiaireCollection.deleteOne({ _id: objectId });
        console.log('Delete result:', result);

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error occurred while deleting student:', error);
        res.status(500).json({ error: 'An error occurred while deleting the student' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
