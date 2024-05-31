import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Configuration() {
  const [configurations, setConfigurations] = useState([]);
  const [form, setForm] = useState({ _id: '', id: '', nom_configuration: '', value: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/configurations')
      .then(response => setConfigurations(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editId) {
      axios.put(`http://localhost:5000/configurations/${editId}`, form)
        .then(response => {
          setConfigurations(configurations.map(config => config._id === editId ? response.data : config));
          setEditId(null);
          setForm({ _id: '', id: '', nom_configuration: '', value: '' });
        })
        .catch(error => console.error('Error updating configuration:', error));
    } else {
      axios.post('http://localhost:5000/configurations', form)
        .then(response => {
          setConfigurations([...configurations, response.data]);
          setForm({ _id: '', id: '', nom_configuration: '', value: '' });
        })
        .catch(error => console.error('Error adding configuration:', error));
    }
  };

  const handleEdit = (id) => {
    const config = configurations.find(config => config._id === id);
    setForm(config);
    setEditId(id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/configurations/${id}`)
      .then(() => {
        setConfigurations(configurations.filter(config => config._id !== id));
      })
      .catch(error => console.error('Error deleting configuration:', error));
  };

  return (
    <Container>
      <Typography variant="h5" component="h1" gutterBottom>Configuration</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom Configuration</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configurations.map(config => (
              <TableRow key={config._id}>
                <TableCell>{config.id}</TableCell>
                <TableCell>{config.nom_configuration}</TableCell>
                <TableCell>{config.value}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(config._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(config._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setForm({ _id: '', id: '', nom_configuration: '', value: '' })}>
        ADD CONFIGURATION
      </Button>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID"
          value={form.id}
          onChange={e => setForm({ ...form, id: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nom Configuration"
          value={form.nom_configuration}
          onChange={e => setForm({ ...form, nom_configuration: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Value"
          value={form.value}
          onChange={e => setForm({ ...form, value: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {editId ? 'Update' : 'Add'}
        </Button>
      </form>
    </Container>
  );
}

export default Configuration;
