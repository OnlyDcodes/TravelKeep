import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Home from './components/Home';
import PlaceDetail from './components/PlaceDetail';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Background3D />
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-maroon-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 font-display drop-shadow-lg">TravelKeep</h2>
          <p className="text-white/80 drop-shadow-lg">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen relative overflow-hidden">
        <Background3D />
        <div className="relative z-10">
          {user && <Navbar user={user} />}
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/" 
              element={user ? <Home user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/place/:placeId" 
              element={user ? <PlaceDetail user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
