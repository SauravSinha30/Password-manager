import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './component/Navbar'
import Background from './component/Background'
import Manager from './component/Manager'
import Auth from './pages/Auth'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if a token exists in local storage
  const token = localStorage.getItem('token');
  
  // If no token, redirect to the Auth page. Otherwise, render the requested component.
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {


  return (
      <Router>
      <div className="min-h-screen  text-zinc-100 font-sans">
        
        {/* Optional: Add a Navbar here if you want it visible on all pages */}
        <Background/>
        <Navbar/>

        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Route - Wraps the Manager component */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Manager />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App
