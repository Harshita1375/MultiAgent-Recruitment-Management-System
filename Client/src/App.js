import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile'; 
import SelectRole from './SelectRole';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Main Entry Point */}
        <Route path="/" element={<Login setUser={setUser} />} />
        
        {/* Role Selection Page for First-Time Google Users */}
        <Route path="/select-role" element={<SelectRole setUser={setUser} />} />

        {/* Dashboard Routes based on User Role */}
        <Route path="/candidate-dashboard" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        <Route path="/company-dashboard" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={user ? <Profile user={user} /> : <Navigate to="/" />} />

        {/* General Profile Route */}
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;