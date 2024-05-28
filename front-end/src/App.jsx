// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './NavComponents/Navbar';
import Sidebar from './SideComponents/Sidebar';
import Emplois from './SideComponents/Emplois';
import Inscriptions from './SideComponents/Inscriptions';
import Stagiaire from './SideComponents/Stagiaire';
import Groups from './SideComponents/Groups';
import Years from './SideComponents/Years';
import Configuration from './SideComponents/Configuration';
import Camera from './NavComponents/Camera';
import Analyse from './NavComponents/Analyse';
import Present from './NavComponents/Present';
import Retard from './NavComponents/Retard';
import Abscent from './NavComponents/Abscent';
import Footer from './Footer/Footer'; 
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh )' }}>
        <Navbar />
        <div style={{ display: 'flex', marginTop: '30px', flex: 1 }}>
          <Sidebar />
          <div style={{ marginLeft: '200px', flex: 1, paddingTop: '30px' }}>
            <Routes>
              <Route path="/camera" element={<Camera />} />
              <Route path="/analyse" element={<Analyse />} />
              <Route path="/present" element={<Present />} />
              <Route path="/retard" element={<Retard />} />
              <Route path="/abscent" element={<Abscent />} />
              <Route path="/emplois" element={<Emplois />} />
              <Route path="/inscriptions" element={<Inscriptions />} />
              <Route path="/stagiaire" element={<Stagiaire />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/years" element={<Years />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
          </div>
        </div>
        <Footer /> {/* Include Footer component at the bottom of the page */}
      </div>
    </Router>
  );
}

export default App;
