const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const emploiSchema = new mongoose.Schema({
  id_group: Number,
  start: Date,
  end: Date,
  module_name: String,
}, { collection: 'emploi' });

const Emploi = mongoose.model('Emploi', emploiSchema);

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

// Update an emploi
app.put('/api/emplois/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmploi = await Emploi.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEmploi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete an emploi
app.delete('/api/emplois/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Emploi.findByIdAndDelete(id);
    res.json({ message: 'Emploi deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
