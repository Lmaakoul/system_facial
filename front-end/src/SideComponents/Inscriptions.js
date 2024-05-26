import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const Inscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [year, setYear] = useState('');
  const [stagiaire, setStagiaire] = useState('');
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = () => {
    axios.get('http://localhost:5000/inscriptions')
      .then(response => setInscriptions(response.data))
      .catch(error => console.error('Error fetching inscriptions:', error));
  };

  const handleAddInscription = () => {
    axios.post('http://localhost:5000/inscriptions', {
      id_group: parseInt(groupId),
      id_year: parseInt(year),
      id_stagiaire: stagiaire
    })
      .then(response => {
        fetchInscriptions(); // Refresh inscriptions after adding
        setGroupId('');
        setYear('');
        setStagiaire('');
      })
      .catch(error => console.error('Error adding inscription:', error));
  };

  const handleEditInscription = (id) => {
    const inscription = inscriptions.find(inscription => inscription._id === id);

    if (inscription) {
      setGroupId(inscription.id_group.toString());
      setYear(inscription.id_year.toString());
      setStagiaire(inscription.id_stagiaire);
      setEditId(id);
      setOpenEditDialog(true);
    } else {
      console.error('Inscription not found for ID:', id);
    }
  };

  const handleUpdateInscription = () => {
    if (!editId) {
      console.error("Edit ID is undefined");
      return;
    }

    axios.put(`http://localhost:5000/inscriptions/${editId}`, {
      id_group: parseInt(groupId),
      id_year: parseInt(year),
      id_stagiaire: stagiaire
    })
      .then(response => {
        const updatedInscriptions = inscriptions.map(inscription => {
          if (inscription._id === editId) {
            return {
              ...inscription,
              id_group: parseInt(groupId),
              id_year: parseInt(year),
              id_stagiaire: stagiaire
            };
          }
          return inscription;
        });
        setInscriptions(updatedInscriptions);
        setGroupId('');
        setYear('');
        setStagiaire('');
        setEditId(null);
        setOpenEditDialog(false);
      })
      .catch(error => console.error('Error updating inscription:', error));
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteInscription = () => {
    axios.delete(`http://localhost:5000/inscriptions/${deleteId}`)
      .then(() => {
        setInscriptions(inscriptions.filter(inscription => inscription._id !== deleteId));
        setOpenDeleteDialog(false);
        setDeleteId(null);
      })
      .catch(error => console.error('Error deleting inscription:', error));
  };

  return (
    <div>
      <div>
        <h1>Inscriptions List</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Group ID</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Stagiaire</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inscriptions.map(inscription => (
                <TableRow key={inscription._id}>
                  <TableCell>{inscription._id}</TableCell>
                  <TableCell>{inscription.id_group}</TableCell>
                  <TableCell>{inscription.id_year}</TableCell>
                  <TableCell>{inscription.id_stagiaire}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditInscription(inscription._id)}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteConfirmation(inscription._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Inscription</DialogTitle>
        <DialogContent>
          <TextField
            label="Group ID"
            variant="outlined"
            value={groupId}
            onChange={e => setGroupId(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Year"
            variant="outlined"
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Stagiaire"
            variant="outlined"
            value={stagiaire}
            onChange={e => setStagiaire(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateInscription} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this inscription?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteInscription} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <h2>Add Inscription</h2>
        <TextField
          label="Group ID"
          variant="outlined"
          value={groupId}
          onChange={e => setGroupId(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Year"
          variant="outlined"
          value={year}
          onChange={e => setYear(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Stagiaire"
          variant="outlined"
          value={stagiaire}
          onChange={e => setStagiaire(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddInscription}>Add Inscription</Button>
      </div>
    </div>
  );
};

export default Inscriptions;
