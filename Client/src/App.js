import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile'; 

function App() {
  // Global user state shared between components
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Route for Login Page */}
        <Route path="/" element={<Login setUser={setUser} />} />
        
        {/* Route for Profile Page */}
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;