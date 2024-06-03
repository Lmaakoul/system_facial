const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Schema and Model
const yearSchema = new mongoose.Schema({
  start_year: {
    type: Date,
    required: true
  },
  end_year: {
    type: Date,
    required: true
  },
  nom_year: {
    type: String,
    required: true
  }
});

const Year = mongoose.model('Year', yearSchema);

// Routes
app.get('/years', async (req, res) => {
  try {
    const years = await Year.find();
    res.json(years);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/years', async (req, res) => {
  try {
    const { start_year, end_year, nom_year } = req.body;
    if (!start_year || !end_year || !nom_year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newYear = new Year({ start_year, end_year, nom_year });
    await newYear.save();
    res.status(201).json(newYear);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/years/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Year.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/years/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { start_year, end_year, nom_year } = req.body;
    if (!start_year || !end_year || !nom_year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const updatedYear = await Year.findByIdAndUpdate(id, { start_year, end_year, nom_year }, { new: true });
    res.json(updatedYear);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
