const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  const groupSchema = new mongoose.Schema({
    _id: Number,
    id_group: Number,
    nom_group: String
  });

  const Group = mongoose.model('Group', groupSchema);

  // Route to get all groups
  app.get('/api/groups', async (req, res) => {
    try {
      const groups = await Group.find();
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Route to add a new group
  app.post('/api/groups', async (req, res) => {
    try {
      const { id_group, nom_group } = req.body;
      const newGroup = new Group({ _id: id_group, id_group, nom_group });
      await newGroup.save();
      res.status(201).json(newGroup);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Route to delete a group
  app.delete('/api/groups/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Group.deleteOne({ _id: id });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Route to update a group
  app.put('/api/groups/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { nom_group } = req.body;
      const updatedGroup = await Group.findByIdAndUpdate(id, { nom_group }, { new: true });
      res.json(updatedGroup);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
