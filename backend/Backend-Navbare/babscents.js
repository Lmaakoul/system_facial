const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());  // Enable CORS
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const abscentsSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  id_inscription: Number,
  id_emploi: Number,
  date: String,
  time: String,
  status: String
});

const abscents = mongoose.model('abscents', abscentsSchema);

app.get('/abscents', async (req, res) => {
  try {
    const abscentsData = await abscents.find();
    res.json(abscentsData);
  } catch (error) {
    console.error('Error accessing abscents data:', error);
    res.status(500).json({ error: 'Error accessing abscents data' });
  }
});

app.put('/abscents/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedAbscents = await abscents.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedAbscents) {
      return res.status(404).json({ error: 'Abscents data not found' });
    }

    res.json(updatedAbscents);
  } catch (error) {
    console.error('Error updating abscents data:', error);
    res.status(500).json({ error: 'Error updating abscents data' });
  }
});

app.delete('/abscents/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAbscents = await abscents.findByIdAndDelete(id);

    if (!deletedAbscents) {
      return res.status(404).json({ error: 'Abscents data not found' });
    }

    res.json({ message: 'Abscents data deleted successfully' });
  } catch (error) {
    console.error('Error deleting abscents data:', error);
    res.status(500).json({ error: 'Error deleting abscents data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
