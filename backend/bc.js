const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const configurationSchema = new mongoose.Schema({
  nom_configuration: String,
  value: String
});

const Configuration = mongoose.model('Configuration', configurationSchema);

app.use(bodyParser.json());

app.get('/api/configurations', async (req, res) => {
  try {
    const configurations = await Configuration.find();
    res.json(configurations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/configurations', async (req, res) => {
  const configuration = new Configuration({
    nom_configuration: req.body.nom_configuration,
    value: req.body.value
  });

  try {
    const newConfiguration = await configuration.save();
    res.status(201).json(newConfiguration);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
