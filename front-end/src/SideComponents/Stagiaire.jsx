import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import './Stagiaire.css';

const Stagiaire = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [filterGroup, setFilterGroup] = useState('');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
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
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        console.log('Students fetched from API:', data);
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Stagiaire;
