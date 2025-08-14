//Path: /src/routes.js
//Focus:  Central Routing
//Version Update: Content Routing intial scaffold. 

// Import necessary modules for routing
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components based on actual file structure
import Login from './pages/login/Login.jsx';
import MuseDashboard from './pages/dashboard/MuseDashboard.jsx';
import User from './pages/user/User.jsx';

// Function for AppRoutes
function AppRoutes() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
        />
        
        {/* User Profile Route */}
        <Route 
          path="/profile" 
          element={<User user={user} setUser={setUser} />} 
        />
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={<MuseDashboard user={user} />} 
        />
        
        {/* Catch-all redirect */}
        <Route 
          path="*" 
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default AppRoutes;