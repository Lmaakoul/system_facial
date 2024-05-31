const mongoose = require('mongoose');

// Define the Configuration schema
const configurationSchema = new mongoose.Schema({
  nom_configuration: String,
  value: String
});

// Create the Configuration model
const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;
