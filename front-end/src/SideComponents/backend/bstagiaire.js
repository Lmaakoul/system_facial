const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

app.use(cors()); 

const client = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

connectDatabase();

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.get('/stagiaire', async (req, res) => {
    try {
        const db = client.db("system_facial");
        const groupsCollection = db.collection("groups");
        const inscriptionCollection = db.collection("inscription");
        const stagiaireCollection = db.collection("stagiaire");

        const groupName = req.query.groupName;
        if (!groupName) {
            return res.status(400).json({ error: "Group name is required" });
        }

        const group = await groupsCollection.findOne({ nom_groub: groupName });
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const inscriptionRecords = await inscriptionCollection.find({ id_group: group._id }).toArray();

        const stagiaireIds = inscriptionRecords.map(record => record.id_stagaire);
        const stagiaires = await stagiaireCollection.find({ _id: { $in: stagiaireIds.map(ObjectId) } }).toArray();

        res.json(stagiaires);
    } catch (error) {
        console.error("Error fetching stagiaires:", error);
        res.status(500).json({ error: "Failed to fetch stagiaires" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
