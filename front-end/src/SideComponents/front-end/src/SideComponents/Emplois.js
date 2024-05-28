import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const Emplois = () => {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedEmploiData, setUpdatedEmploiData] = useState(null);
  const [newSessionData, setNewSessionData] = useState({}); // Define newSessionData

  useEffect(() => {
    const fetchEmplois = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/emplois');
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

    fetchEmplois();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/emplois/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmploiData),
      });
      // Handle response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/emplois/${id}`, {
        method: 'DELETE',
      });
      // Handle response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddSession = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/emplois`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSessionData), // Use newSessionData here
      });
      // Handle response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}> Emplois du Temps</h1>
      {error && <div>{error}</div>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Groups</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Finish</TableCell>
              <TableCell> Name Module</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emplois.map((emploi, index) => (
              <TableRow key={index}>
                <TableCell>{emploi.id_group}</TableCell>
                <TableCell>{emploi.start}</TableCell>
                <TableCell>{emploi.end}</TableCell>
                <TableCell>{emploi.module_name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(emploi._id)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(emploi._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleAddSession} style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>Add Session</Button>
    </div>
  );
};

export default Emplois;
