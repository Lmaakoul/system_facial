import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Container, Paper } from '@mui/material';
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

  useEffect(() => {
    fetch('http://localhost:3000/years')
      .then(response => response.json())
      .then(data => setYears(data))
      .catch(error => console.error('Error fetching years:', error));
  }, []);

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
              </TableRow>
            </TableHead>
            <TableBody>
              {years.map(year => (
                <TableRow key={year._id}>
                  <TableCell>{formatDate(year.start_year)}</TableCell>
                  <TableCell>{formatDate(year.end_year)}</TableCell>
                  <TableCell>{year.nom_year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
}

export default Years;
