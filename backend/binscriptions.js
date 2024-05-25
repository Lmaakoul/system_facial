// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment port or 5000

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/system_facial', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Inscription Model
const Inscription = mongoose.model('Inscription', {
  id_group: Number,
  id_year: Number,
  id_stagiaire: String
});

// Routes
app.get('/inscriptions', async (req, res) => {
  try {
    const inscriptions = await Inscription.find();
    res.status(200).json(inscriptions);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching inscriptions', error: err.message });
  }
});

app.get('/inscriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const inscription = await Inscription.findById(id);
    if (!inscription) {
      return res.status(404).json({ msg: 'Inscription not found' });
    }
    res.status(200).json(inscription);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching inscription', error: err.message });
  }
});

app.post('/inscriptions', async (req, res) => {
  const { id_group, id_year, id_stagiaire } = req.body;
  try {
    const newInscription = new Inscription({ id_group, id_year, id_stagiaire });
    await newInscription.save();
    res.status(201).json(newInscription);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding inscription', error: err.message });
  }
});

app.put('/inscriptions/:id', async (req, res) => {
  const { id } = req.params;
  const { id_group, id_year, id_stagiaire } = req.body;
  try {
    const updatedInscription = await Inscription.findByIdAndUpdate(id,
      { id_group, id_year, id_stagiaire },
      { new: true }
    );
    if (!updatedInscription) {
      return res.status(404).json({ msg: 'Inscription not found' });
    }
    res.status(200).json(updatedInscription);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating inscription', error: err.message });
  }
});

app.delete('/inscriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedInscription = await Inscription.findByIdAndDelete(id);
    if (!deletedInscription) {
      return res.status(404).json({ msg: 'Inscription not found' });
    }
    res.status(200).json({ msg: 'Inscription deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting inscription', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
