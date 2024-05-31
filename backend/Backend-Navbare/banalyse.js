const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/system_facial', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const Retard = mongoose.model('retard', new mongoose.Schema({
    nom: String,
    prenom: String,
    id_inscription: Number,
    id_emploi: Number,
    date: String,
    time: String,
    status: String,
    groupId: String // Ensure group ID field is correct
}));

const Abscent = mongoose.model('abscent', new mongoose.Schema({
    nom: String,
    prenom: String,
    id_inscription: Number,
    id_emploi: Number,
    date: String,
    time: String,
    groupId: String // Ensure group ID field is correct
}));

const Group = mongoose.model('group', new mongoose.Schema({
    nom_groub: String,
}));

// Endpoint to fetch attendance data
app.get('/data', async (req, res) => {
    try {
        const retards = await Retard.find();
        const abscents = await Abscent.find();
        console.log('Fetched attendance data:', { retards, abscents });
        res.json({ retards, abscents });
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).send('Server error');
    }
});

// Endpoint to fetch groups data
app.get('/groups', async (req, res) => {
    try {
        const groups = await Group.find();
        console.log('Fetched groups:', groups);
        res.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).send('Server error');
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
