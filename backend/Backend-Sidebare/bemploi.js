const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Types } = mongoose;

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/system_facial')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const emploiSchema = new mongoose.Schema({
  id_group: Number,
  start: Date,
  end: Date,
  module_name: String,
}, { collection: 'emploi' });

const Emploi = mongoose.model('Emploi', emploiSchema);

const groupSchema = new mongoose.Schema({
  id_group: Number,
  nom_group: String,
}, { collection: 'groups' });

const Group = mongoose.model('Group', groupSchema);

// Helper function to check if ID is a valid ObjectId
const isValidObjectId = (id) => Types.ObjectId.isValid(id) && (new Types.ObjectId(id)).toString() === id;

// Fetch all emplois
app.get('/api/emplois', async (req, res) => {
  try {
    const emplois = await Emploi.find();
    res.json(emplois);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add an emploi
app.post('/api/emplois', async (req, res) => {
  try {
    const newEmploi = new Emploi(req.body);
    await newEmploi.save();
    res.json(newEmploi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update an emploi
app.put('/api/emplois/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating emploi with ID: ${id}`);  // Log the ID being updated
    console.log('Request body:', req.body);  // Log the data being sent in the request body

    const query = isValidObjectId(id) ? { _id: id } : { _id: parseInt(id, 10) };
    const updatedEmploi = await Emploi.findOneAndUpdate(query, req.body, { new: true });
    if (!updatedEmploi) {
      return res.status(404).json({ message: 'Emploi not found' });
    }
    res.json(updatedEmploi);
  } catch (error) {
    console.error('Error updating emploi:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete an emploi
app.delete('/api/emplois/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id) ? { _id: id } : { _id: parseInt(id, 10) };
    const deletedEmploi = await Emploi.findOneAndDelete(query);
    if (!deletedEmploi) {
      return res.status(404).json({ message: 'Emploi not found' });
    }
    res.json(deletedEmploi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
