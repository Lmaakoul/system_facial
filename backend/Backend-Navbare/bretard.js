const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importing cors

const app = express();
const PORT = process.env.PORT || 5006; // Updated port to 5006

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const retardSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  id_inscription: Number,
  id_emploi: Number,
  date: String,
  time: String,
  status: String
});

const Retard = mongoose.model('Retard', retardSchema);

app.use(cors()); // Enabling CORS for all requests
app.use(express.json()); // Middleware to parse request body as JSON

// Route to get all retard data
app.get('/retards', async (req, res) => {
  try {
    const retardData = await Retard.find();
    res.json(retardData);
  } catch (error) {
    console.error('Error accessing Retard data:', error);
    res.status(500).json({ error: 'Error accessing Retard data' });
  }
});

// Route to update retard data
app.put('/retards/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedRetard = await Retard.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedRetard) {
      return res.status(404).json({ error: 'Retard data not found' });
    }

    res.json(updatedRetard);
  } catch (error) {
    console.error('Error updating Retard data:', error);
    res.status(500).json({ error: 'Error updating Retard data' });
  }
});

// Route to delete retard data
app.delete('/retards/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedRetard = await Retard.findByIdAndDelete(id);

    if (!deletedRetard) {
      return res.status(404).json({ error: 'Retard data not found' });
    }

    res.json({ message: 'Retard data deleted successfully' });
  } catch (error) {
    console.error('Error deleting Retard data:', error);
    res.status(500).json({ error: 'Error deleting Retard data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
