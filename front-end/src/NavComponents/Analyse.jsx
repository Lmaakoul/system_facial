import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';

const Analyse = () => {
    const [data, setData] = useState({ retards: [], abscents: [] });
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    useEffect(() => {
        // Fetch attendance data from the server
        axios.get('http://localhost:5000/data')
            .then(response => {
                console.log('Data fetched successfully:', response.data); // Debug log
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                console.log(error.response); // Print error response for debugging
            });

        // Fetch groups from the server
        axios.get('http://localhost:5000/groups')
            .then(response => {
                console.log('Groups fetched successfully:', response.data); // Debug log
                setGroups(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                console.log(error.response); // Print error response for debugging
            });
    }, []);

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
        console.log('Group selected:', event.target.value); // Debug log
    };

    const filteredRetards = selectedGroup
        ? data.retards.filter(entry => entry.groupId === selectedGroup)
        : data.retards;

    const filteredAbscents = selectedGroup
        ? data.abscents.filter(entry => entry.groupId === selectedGroup)
        : data.abscents;

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Attendance Data Analysis
            </Typography>

            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id="group-select-label">Select Group</InputLabel>
                <Select
                    labelId="group-select-label"
                    id="group-select"
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    label="Select Group"
                >
                    <MenuItem value="">
                        <em>All Groups</em>
                    </MenuItem>
                    {groups.map((group, index) => (
                        <MenuItem key={index} value={group.nom_groub}>
                            {group.nom_groub}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Present
                    </Typography>
                    {filteredRetards.filter(entry => entry.status === 'present').map((student, index) => (
                        <Box key={index} sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', boxShadow: 1 }}>
                            <Typography variant="h6" component="div">
                                Prenom: {student.prenom} <br />
                                Name: {student.nom}
                            </Typography>
                            <Typography variant="body1">Present: {filteredRetards.filter(entry => entry.status === 'present').length}</Typography>
                        </Box>
                    ))}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Late
                    </Typography>
                    {filteredRetards.filter(entry => entry.status === 'late').map((student, index) => (
                        <Box key={index} sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', boxShadow: 1 }}>
                            <Typography variant="h6" component="div">
                                Prenom: {student.prenom} <br />
                                Name: {student.nom}
                            </Typography>
                            <Typography variant="body1">Late: {filteredRetards.filter(entry => entry.status === 'late').length}</Typography>
                        </Box>
                    ))}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Absent
                    </Typography>
                    {filteredAbscents.map((student, index) => (
                        <Box key={index} sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', boxShadow: 1 }}>
                            <Typography variant="h6" component="div">
                                Prenom: {student.prenom} <br />
                                Name: {student.nom}
                            </Typography>
                            <Typography variant="body1">Absent: {filteredAbscents.length}</Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analyse;
