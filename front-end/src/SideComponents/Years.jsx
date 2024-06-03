import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Container, Paper, TextField, Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Years() {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState({ start_year: '', end_year: '', nom_year: '' });
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await fetch('http://localhost:5003/years');
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleAddYear = async () => {
    try {
      const response = await fetch('http://localhost:5003/years', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newYear),
      });
      if (!response.ok) {
        throw new Error('Failed to add year');
      }
      setNewYear({ start_year: '', end_year: '', nom_year: '' });
      fetchYears();
    } catch (error) {
      console.error('Error adding year:', error);
    }
  };

  const handleDeleteYear = async (id) => {
    if (!id) {
      console.error('Error: id is undefined');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5003/years/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete year');
      }
      fetchYears();
    } catch (error) {
      console.error('Error deleting year:', error);
    }
  };

  const handleUpdateYear = async () => {
    try {
      const response = await fetch(`http://localhost:5003/years/${selectedYear._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedYear),
      });
      if (!response.ok) {
        throw new Error('Failed to update year');
      }
      setSelectedYear(null);
      fetchYears();
    } catch (error) {
      console.error('Error updating year:', error);
    }
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          Years
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Year</TableCell>
                <TableCell>End Year</TableCell>
                <TableCell>Year Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {years.map((year) => (
                <TableRow key={year._id}>
                  <TableCell>{formatDate(year.start_year)}</TableCell>
                  <TableCell>{formatDate(year.end_year)}</TableCell>
                  <TableCell>{year.nom_year}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteYear(year._id)} variant="outlined" color="error">Delete</Button>
                    <Button onClick={() => handleSelectYear(year)} variant="outlined" color="primary">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <div>
          <TextField
            label="Start Year"
            type="date"
            value={newYear.start_year}
            onChange={(e) => setNewYear({ ...newYear, start_year: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Year"
            type="date"
            value={newYear.end_year}
            onChange={(e) => setNewYear({ ...newYear, end_year: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Year Name"
            value={newYear.nom_year}
            onChange={(e) => setNewYear({ ...newYear, nom_year: e.target.value })}
          />
          <Button onClick={handleAddYear} variant="contained" color="primary">Add Year</Button>
        </div>
        {selectedYear && (
          <div>
            <h3>Edit Year</h3>
            <TextField
              label="Start Year"
              type="date"
              value={selectedYear.start_year}
              onChange={(e) => setSelectedYear({ ...selectedYear, start_year: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Year"
              type="date"
              value={selectedYear.end_year}
              onChange={(e) => setSelectedYear({ ...selectedYear, end_year: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Year Name"
              value={selectedYear.nom_year}
              onChange={(e) => setSelectedYear({ ...selectedYear, nom_year: e.target.value })}
            />
            <Button onClick={handleUpdateYear} variant="contained" color="primary">Save</Button>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
}

export default Years;
