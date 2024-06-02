import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './Stagiaire.css';

const Inscriptions = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filterGroup, setFilterGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: '',
    nom_groub: '',
    image: null,
    face_encoding: ''
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.message);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/stagiaire${filterGroup ? `?nom_groub=${filterGroup}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError(error.message);
      }
    };

    fetchStudents();
  }, [filterGroup]);

  const handleFilterChange = (event) => {
    setFilterGroup(event.target.value);
  };

  const handleAddStudent = () => {
    setOpenDialog(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData(student);
    setOpenDialog(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await fetch(`http://localhost:5000/stagiaire/${studentId}`, {
        method: 'DELETE'
      });
      setStudents(students.filter(student => student._id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setFormData({
      nom: '',
      prenom: '',
      date_naissance: '',
      genre: '',
      nom_groub: '',
      image: null,
      face_encoding: ''
    });
  };

  const handleSubmitForm = async () => {
    try {
      const formDataWithFile = new FormData();
      Object.keys(formData).forEach(key => {
        formDataWithFile.append(key, formData[key]);
      });

      if (selectedStudent) {
        await fetch(`http://localhost:5000/stagiaire/${selectedStudent._id}`, {
          method: 'PUT',
          body: formDataWithFile,
        });
        const updatedStudents = students.map(student => {
          if (student._id === selectedStudent._id) {
            return { ...student, ...formData };
          }
          return student;
        });
        setStudents(updatedStudents);
      } else {
        const response = await fetch('http://localhost:5000/stagiaire', {
          method: 'POST',
          body: formDataWithFile,
        });
        const data = await response.json();
        setStudents([...students, data]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenerateFaceEncoding = async (student) => {
    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('image', student.image);

      const response = await fetch('http://localhost:5000/api/face-encoding', {
        method: 'POST',
        body: formDataWithFile,
      });

      if (!response.ok) throw new Error('Error generating face encoding');

      const data = await response.json();
      const updatedStudents = students.map(s => {
        if (s._id === student._id) {
          return { ...s, face_encoding: data.face_encoding };
        }
        return s;
      });
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error generating face encoding:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial', color: 'blue' }}>Stagiaire</Typography>
      {error && <div>Error: {error}</div>}
      <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: '200px' }}>
        <InputLabel>Group</InputLabel>
        <Select value={filterGroup} onChange={handleFilterChange} label="Group">
          <MenuItem value="">All Groups</MenuItem>
          {groups.map(group => (
            <MenuItem key={group.nom_groub} value={group.nom_groub}>{group.nom_groub}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleAddStudent} variant="contained" color="primary" style={{ marginBottom: '20px' }}>Add Student</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Date de Naissance</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Nom Group</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Face Encoding</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student._id}>
                <TableCell>{student.nom}</TableCell>
                <TableCell>{student.prenom}</TableCell>
                <TableCell>{student.date_naissance}</TableCell>
                <TableCell>{student.genre}</TableCell>
                <TableCell>{student.nom_groub}</TableCell>
                <TableCell>
                  {student.imagePath && <img src={`http://localhost:5000/${student.imagePath}`} alt={student.nom} style={{ width: '50px', height: '50px' }} />}
                </TableCell>
                <TableCell>{student.face_encoding}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditStudent(student)} variant="contained" color="primary" style={{ marginRight: '10px' }}>Edit</Button>
                  <Button onClick={() => handleDeleteStudent(student._id)} variant="contained" color="secondary">Delete</Button>
                  {!student.face_encoding && (
                    <Button
                      onClick={() => handleGenerateFaceEncoding(student)}
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                    >
                      Generate Face Encoding
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="date_naissance"
              label="Date de Naissance"
              type="date"
              value={formData.date_naissance}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="genre"
              label="Genre"
              value={formData.genre}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Nom Group</InputLabel>
              <Select
                name="nom_groub"
                value={formData.nom_groub}
                onChange={handleChange}
              >
                {groups.map(group => (
                  <MenuItem key={group.nom_groub} value={group.nom_groub}>{group.nom_groub}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              name="image"
              onChange={handleChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="primary" component="span" startIcon={<PhotoCamera />}>
                Upload
              </Button>
            </label>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSubmitForm} color="primary">{selectedStudent ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inscriptions;
