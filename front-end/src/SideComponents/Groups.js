import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddGroup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom_groub: newGroup }),
      });
      if (!response.ok) {
        throw new Error('Failed to add group');
      }
      setNewGroup('');
      fetchGroups();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete group');
      }
      fetchGroups();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleUpdateGroup = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${selectedGroup._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedGroup),
      });
      if (!response.ok) {
        throw new Error('Failed to update group');
      }
      fetchGroups();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Groups</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group._id}>
                <TableCell>{group._id}</TableCell>
                <TableCell>{group.nom_groub}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteGroup(group._id)} variant="outlined" color="error">Delete</Button>
                  <Button onClick={() => handleSelectGroup(group)} variant="outlined" color="primary">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <TextField label="New Group" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
        <Button onClick={handleAddGroup} variant="contained" color="primary">Add Group</Button>
      </div>
      {selectedGroup && (
        <div>
          <h3>Edit Group</h3>
          <TextField
            label="Group Name"
            value={selectedGroup.nom_groub}
            onChange={(e) => setSelectedGroup({ ...selectedGroup, nom_groub: e.target.value })}
          />
          <Button onClick={handleUpdateGroup} variant="contained" color="primary">Save</Button>
        </div>
      )}
    </div>
  );
};

export default Groups;
