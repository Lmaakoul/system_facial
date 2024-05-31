const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // استيراد مكتبة UUID

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/system_facial', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const configurationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 }, // استخدام UUID للحقل id
  nom_configuration: String,
  value: String
});

const Configuration = mongoose.model('Configuration', configurationSchema);

// قراءة جميع الإعدادات
app.get('/configurations', async (req, res) => {
  try {
    const configs = await Configuration.find();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إنشاء إعداد جديد
app.post('/configurations', async (req, res) => {
  const config = new Configuration({ ...req.body, id: uuidv4() });
  try {
    const newConfig = await config.save();
    res.status(201).json(newConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// تحديث إعداد موجود
app.put('/configurations/:id', async (req, res) => {
  console.log('PUT /configurations/:id:', req.body); // Log the request body
  try {
    const updatedConfig = await Configuration.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedConfig) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json(updatedConfig);
  } catch (error) {
    console.error('Error updating configuration:', error); // Log the error
    res.status(400).json({ message: error.message });
  }
});

// حذف إعداد
app.delete('/configurations/:id', async (req, res) => {
  try {
    await Configuration.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
