const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/start-finish', (req, res) => {
  const pythonProcess = spawn('python', ['C:\\Users\\lenovo\\OneDrive\\Bureau\\projet_1\\code_face_recognation\\finish.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  res.json({ message: 'Face recognition process started.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
