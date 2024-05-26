import React from 'react';
import { Typography, Paper, Container } from '@mui/material';

function Analyse() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Analyse
        </Typography>
        <Typography variant="body1" align="center">
Analyse data 
        </Typography>
      </Paper>
    </Container>
  );
}

export default Analyse;
