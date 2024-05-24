// Required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Define Inscription Schema and Model
const inscriptionSchema = new mongoose.Schema({
  id_group: Number,
  id_year: Number,
  id_stagiaire: String
});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

// Routes

// Add an inscription
app.post('/add_inscription', async (req, res) => {
  const { id_group, id_year, id_stagiaire } = req.body;

  try {
    const newInscription = new Inscription({ id_group, id_year, id_stagiaire });
    await newInscription.save();
    res.status(201).json({ msg: 'Inscription added', inscription: newInscription });
  } catch (err) {
    console.error('Error saving inscription:', err);
    res.status(500).json({ msg: 'Error saving inscription', error: err.message });
  }
});

// Get all inscriptions
app.get('/inscriptions', async (req, res) => {
  try {
    const inscriptions = await Inscription.find({});
    res.status(200).json(inscriptions);
  } catch (err) {
    console.error('Error fetching inscriptions:', err);
    res.status(500).json({ msg: 'Error fetching inscriptions', error: err.message });
  }
});

// Update an inscription by ID
app.put('/inscriptions/:id', async (req, res) => {
  const { id } = req.params;
  const { id_group, id_year, id_stagiaire } = req.body;

  try {
    const updatedInscription = await Inscription.findByIdAndUpdate(id, { id_group, id_year, id_stagiaire }, { new: true });

    if (!updatedInscription) {
      return res.status(404).json({ msg: 'Inscription not found' });
    }

    res.status(200).json({ msg: 'Inscription updated', inscription: updatedInscription });
  } catch (err) {
    console.error('Error updating inscription:', err);
    res.status(500).json({ msg: 'Error updating inscription', error: err.message });
  }
});

// Delete an inscription by ID
app.delete('/inscriptions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInscription = await Inscription.findByIdAndDelete(id);

    if (!deletedInscription) {
      return res.status(404).json({ msg: 'Inscription not found' });
    }

    res.status(200).json({ msg: 'Inscription deleted', inscription: deletedInscription });
  } catch (err) {
    console.error('Error deleting inscription:', err);
    res.status(500).json({ msg: 'Error deleting inscription', error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
