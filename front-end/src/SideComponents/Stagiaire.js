import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import './Stagiaire.css';

const Stagiaire = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filterGroup, setFilterGroup] = useState(''); 

  useEffect(() => {
    fetch(`http://localhost:5000/stagiaire${filterGroup ? `?groupId=${filterGroup}` : ''}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        return response.json();
      })
      .then(data => setStudents(data))
      .catch(error => {
        console.error('Error fetching students:', error);
        setError(error.message);
      });
  }, [filterGroup]);

  const handleFilterChange = (event) => {
    setFilterGroup(event.target.value); 
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial', color: 'blue' }}>Stagiaire</Typography>
      {error && <div>Error: {error}</div>}
      <Select value={filterGroup} onChange={handleFilterChange} style={{ marginBottom: '20px' }}>
        <MenuItem value="">All Groups</MenuItem>
        <MenuItem value="Dev101">Dev101</MenuItem>
        <MenuItem value="Info101">Info101</MenuItem>
        <MenuItem value="El101">El101</MenuItem>
        {}
        <MenuItem value="OtherGroup">OtherGroup</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Date de Naissance</TableCell>
              <TableCell>Genre</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Stagiaire;
