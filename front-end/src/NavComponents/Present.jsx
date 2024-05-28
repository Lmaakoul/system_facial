import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  TextField,
  Box,
} from '@mui/material';

function Presence() {
  const [presenceData, setPresenceData] = useState([]);
  const [editData, setEditData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/presence');
      setPresenceData(response.data);
    } catch (error) {
      console.error('Error fetching presence data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteItemId(item._id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/presence/${editData._id}`, editData);
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/presence/${deleteItemId}`);
      setIsDeleteModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <Typography variant="h3" gutterBottom>Presence Data</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prenom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presenceData.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.prenom}</TableCell>
                <TableCell>{item.nom}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(item)}>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(item)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="edit-modal-title" variant="h6" component="h2" gutterBottom>Edit Data</Typography>
          <TextField
            label="Prenom"
            fullWidth
            value={editData.prenom}
            onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Nom"
            fullWidth
            value={editData.nom}
            onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Date"
            fullWidth
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Time"
            fullWidth
            value={editData.time}
            onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Status"
            fullWidth
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            margin="normal"
          />
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </Box>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="delete-modal-title" variant="h6" component="h2" gutterBottom>Are you sure you want to delete?</Typography>
          <Button variant="contained" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Presence;
