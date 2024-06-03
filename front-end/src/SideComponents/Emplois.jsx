import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';

const Emplois = () => {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newEmploi, setNewEmploi] = useState({ id_group: '', start: '', end: '', module_name: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchEmplois = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/emplois');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        setEmplois(data);
      } catch (error) {
        console.error(error);
        setError('Problem fetching data');
      } finally {
        setLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/groups');
        if (!response.ok) {
          throw new Error('Error fetching groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error);
        setError('Problem fetching groups');
      }
    };

    fetchEmplois();
    fetchGroups();
  }, []);

  const handleEdit = (emploi) => {
    setCurrentEmploi(emploi);
    setNewEmploi({ id_group: emploi.id_group, start: emploi.start, end: emploi.end, module_name: emploi.module_name });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/emplois/${id}`, {
        method: 'DELETE',
      });
      setEmplois(emplois.filter((emploi) => emploi._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddSession = () => {
    setEditMode(false);
    setNewEmploi({ id_group: '', start: '', end: '', module_name: '' });
    setOpen(true);
  };

  const handleSaveSession = async () => {
    try {
      if (editMode) {
        const response = await fetch(`http://localhost:5001/api/emplois/${currentEmploi._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmploi),
        });
        const updatedEmploi = await response.json();
        setEmplois(emplois.map((emploi) => (emploi._id === currentEmploi._id ? updatedEmploi : emploi)));
      } else {
        const response = await fetch(`http://localhost:5001/api/emplois`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmploi),
        });
        const createdEmploi = await response.json();
        setEmplois([...emplois, createdEmploi]);
      }
      setOpen(false);
      setNewEmploi({ id_group: '', start: '', end: '', module_name: '' });
      setCurrentEmploi(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Emplois du Temps</h1>
      {error && <div>{error}</div>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Groups</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Finish</TableCell>
              <TableCell>Name Module</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emplois.map((emploi, index) => (
              <TableRow key={index}>
                <TableCell>{emploi.id_group}</TableCell>
                <TableCell>{new Date(emploi.start).toLocaleString()}</TableCell>
                <TableCell>{new Date(emploi.end).toLocaleString()}</TableCell>
                <TableCell>{emploi.module_name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(emploi)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(emploi._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleAddSession} style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>Add Session</Button>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? 'Edit Session' : 'Add Session'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Group"
            select
            value={newEmploi.id_group}
            onChange={(e) => setNewEmploi({ ...newEmploi, id_group: e.target.value })}
            fullWidth
            margin="normal"
          >
            {groups.map((group) => (
              <MenuItem key={group._id} value={group.id_group}>
                {group.nom_group}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start"
            type="datetime-local"
            value={newEmploi.start}
            onChange={(e) => setNewEmploi({ ...newEmploi, start: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End"
            type="datetime-local"
            value={newEmploi.end}
            onChange={(e) => setNewEmploi({ ...newEmploi, end: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Module Name"
            value={newEmploi.module_name}
            onChange={(e) => setNewEmploi({ ...newEmploi, module_name: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleSaveSession} color="primary">{editMode ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Emplois;
