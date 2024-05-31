const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const logger = require('morgan');

const app = express();
const port = 5000;

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
            nom_groub: stagiaire.nom_groub
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
