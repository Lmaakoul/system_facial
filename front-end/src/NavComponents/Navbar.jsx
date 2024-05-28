import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import '@fontsource/roboto';
import logo from './logo.png';

function Navbar() {
  const handleButtonClick = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      if (!response.ok) {
        throw new Error(` error in request  ${endpoint}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo} alt="logo" style={{ height: 40, marginRight: 10 }} />
        <span style={{ fontFamily: 'Platypi' }}>Facial</span>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/camera" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ fontFamily: 'Roboto', margin: '0 10px', color: 'white' }}>
              Camera
            </Button>
          </Link>
          <Link to="/analyse" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ fontFamily: 'Roboto', margin: '0 10px', color: 'white' }} onClick={() => handleButtonClick('/analyse')}>
              Analyse
            </Button>
          </Link>
          <Link to="/present" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ fontFamily: 'Roboto', margin: '0 10px', color: 'white' }} onClick={() => handleButtonClick('/present')}>
              Presence
            </Button>
          </Link>
          <Link to="/retard" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ fontFamily: 'Roboto', margin: '0 10px', color: 'white' }} onClick={() => handleButtonClick('/retard')}>
              Retard
            </Button>
          </Link>
          <Link to="/abscent" style={{ textDecoration: 'none' }}>
            <Button variant="text" style={{ fontFamily: 'Roboto', margin: '0 10px', color: 'white' }} onClick={() => handleButtonClick('/abscent')}>
              Abscence
            </Button>
          </Link>
        </div>
        <div style={{ flexGrow: 1 }}></div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
