const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const logger = require('morgan');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 5000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/lenovo/OneDrive/Bureau/projet_1/code_face_recognation/student_images');
    },
    filename: (req, file, cb) => {
        const { prenom, nom } = req.body;
        cb(null, `${prenom}_${nom}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/';
const dbName = 'system_facial';
const stagiaireCollectionName = 'stagiaire';
const groupsCollectionName = 'groups';

let db, stagiaireCollection, groupsCollection;

MongoClient.connect(mongoURI, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        stagiaireCollection = db.collection(stagiaireCollectionName);
        groupsCollection = db.collection(groupsCollectionName);
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
            face_encoding: stagiaire.face_encoding // Ensure this field is included
        }));
        res.json(formattedStagiaireList);
    } catch (error) {
        console.error('Error fetching stagiaires:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/api/groups', async (req, res) => {
    try {
        const groups = await stagiaireCollection.distinct('nom_groub');
        res.json(groups.map(group => ({ nom_groub: group })));
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.post('/stagiaire', upload.single('image'), async (req, res) => {
    try {
        const { nom, prenom, date_naissance, genre, nom_groub } = req.body;
        const imagePath = req.file ? req.file.path : null;

        // Find the id_group based on nom_groub
        const group = await groupsCollection.findOne({ nom_group: nom_groub });
        if (!group) {
            return res.status(400).json({ error: 'Group not found' });
        }
        const id_group = group.id_group;

        const newStudent = { nom, prenom, date_naissance, genre, nom_groub, id_group, imagePath, face_encoding: '' }; // Include id_group

        const result = await stagiaireCollection.insertOne(newStudent);
        res.status(201).json({
            _id: result.insertedId.toString(),
            ...newStudent
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.delete('/stagiaire/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const objectId = new ObjectId(studentId);

        const result = await stagiaireCollection.deleteOne({ _id: objectId });

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

app.post('/generate_face_encoding', async (req, res) => {
    try {
        const { imagePath, studentId } = req.body; // Ensure studentId is sent in the request
        console.log('Starting face encoding for:', imagePath);

        const pythonProcess = spawn('python', ['C:/Users/lenovo/OneDrive/Bureau/projet_1/face_encoding/face_encoding.py', imagePath]);

        pythonProcess.stdout.on('data', async (data) => {
            const faceEncoding = data.toString().trim();
            console.log('Face encoding received:', faceEncoding);
            try {
                const parsedEncoding = JSON.parse(faceEncoding);
                // Update the student document with the new face encoding
                const objectId = new ObjectId(studentId);
                const updateResult = await stagiaireCollection.updateOne(
                    { _id: objectId },
                    { $set: { face_encoding: parsedEncoding } }
                );

                if (updateResult.modifiedCount === 1) {
                    console.log('Successfully updated student face encoding');
                    res.json({ face_encoding: parsedEncoding });
                } else {
                    console.error('Failed to update student face encoding');
                    res.status(500).json({ error: 'Failed to update student face encoding' });
                }
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                res.status(500).json({ error: 'Error parsing face encoding data' });
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Error in Python process stderr:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                res.status(500).json({ error: 'An error occurred while generating face encoding' });
            }
        });
    } catch (error) {
        console.error('Error in /generate_face_encoding route:', error);
        res.status(500).json({ error: 'An error occurred while generating face encoding' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
