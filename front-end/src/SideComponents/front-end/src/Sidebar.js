import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SettingsIcon from '@mui/icons-material/Settings';

function Sidebar() {
  return (
    <div className="sidebar" style={{ width: '200px' }}> {/* Adjust the width here */}
      <List>
        <ListItem button component={Link} to="/Dashboard">
          <DashboardIcon />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/Emplois">
          <EventIcon />
          <ListItemText primary="Emplois du temps" />
        </ListItem>
        <ListItem button component={Link} to="/inscriptions">
          <AssignmentIndIcon />
          <ListItemText primary="Inscriptions" />
        </ListItem>
        <ListItem button component={Link} to="/stagiaire">
          <GroupIcon />
          <ListItemText primary="Stagiaire" />
        </ListItem>
        <ListItem button component={Link} to="/groups">
          <FolderIcon />
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button component={Link} to="/years">
          <DateRangeIcon />
          <ListItemText primary="Years" />
        </ListItem>
        <ListItem button component={Link} to="/configuration">
          <SettingsIcon />
          <ListItemText primary="Configuration" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
