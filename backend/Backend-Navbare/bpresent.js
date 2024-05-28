const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const presenceSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  id_inscription: Number,
  id_emploi: Number,
  date: String,
  time: String,
  status: String
});

const Presence = mongoose.model('Presence', presenceSchema);

app.use(express.json()); // Middleware to parse request body as JSON

// Route to get all presence data
app.get('/presence', async (req, res) => {
  try {
    const presenceData = await Presence.find();
    res.json(presenceData);
  } catch (error) {
    console.error('Error accessing Presence data:', error);
    res.status(500).json({ error: 'Error accessing Presence data' });
  }
});

// Route to update presence data
app.put('/presence/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedPresence = await Presence.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedPresence) {
      return res.status(404).json({ error: 'Presence data not found' });
    }

    res.json(updatedPresence);
  } catch (error) {
    console.error('Error updating Presence data:', error);
    res.status(500).json({ error: 'Error updating Presence data' });
  }
});

// Route to delete presence data
app.delete('/presence/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPresence = await Presence.findByIdAndDelete(id);

    if (!deletedPresence) {
      return res.status(404).json({ error: 'Presence data not found' });
    }

    res.json({ message: 'Presence data deleted successfully' });
  } catch (error) {
    console.error('Error deleting Presence data:', error);
    res.status(500).json({ error: 'Error deleting Presence data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
