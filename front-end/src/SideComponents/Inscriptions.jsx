import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
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
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/stagiaire${filterGroup ? `?nom_groub=${filterGroup}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
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
    });
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedStudent) {
        await fetch(`http://localhost:5000/stagiaire/${selectedStudent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial', color: 'blue' }}>Stagiaire</Typography>
      {error && <div>Error: {error}</div>}
      <Select value={filterGroup} onChange={handleFilterChange} style={{ marginBottom: '20px', minWidth: '200px' }}>
        <MenuItem value="">All Groups</MenuItem>
        {groups.map(group => (
          <MenuItem key={group.nom_groub} value={group.nom_groub}>{group.nom_groub}</MenuItem>
        ))}
      </Select>
      <Button onClick={handleAddStudent} variant="contained" color="primary" style={{ marginBottom: '20px' }}>Add Student</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Date de Naissance</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Nom Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student._id}>
                <TableCell>{student._id}</TableCell>
                <TableCell>{student.nom}</TableCell>
                <TableCell>{student.prenom}</TableCell>
                <TableCell>{new Date(student.date_naissance).toLocaleDateString()}</TableCell>
                <TableCell>{student.genre}</TableCell>
                <TableCell>{student.nom_groub}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditStudent(student)} color="primary">Edit</Button>
                  <Button onClick={() => handleDeleteStudent(student._id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField name="nom" label="Nom" value={formData.nom} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="date_naissance" label="Date de Naissance" value={formData.date_naissance} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="genre" label="Genre" value={formData.genre} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="nom_groub" label="Nom Group" value={formData.nom_groub} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitForm} color="primary">{selectedStudent ? 'Save Changes' : 'Add Student'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inscriptions;
