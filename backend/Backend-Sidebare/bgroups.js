const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('good connect ');

  const groupSchema = new mongoose.Schema({
// data likijib hna 

    _id: Number,
    name: String
  });

  // Define Model
  const Group = mongoose.model('Group', groupSchema);

  // Route to get Group data
  app.get('/api/groups', async (req, res) => {
    try {
      console.log('Received GET request to /api/groups');

      // ki9ilib 3la data et sent request
      const groups = await Group.find();
      console.log('Retrieved groups:', groups);
      res.json(groups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '  error serveur' });
    }
  });
// serveur khdam bi3dma dar connect m3a database.
  app.listen(PORT, () => {
    console.log(`   serveur khdam ${PORT}`);
  });
});
