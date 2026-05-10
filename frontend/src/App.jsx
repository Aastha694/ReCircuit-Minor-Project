import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Show } from '@clerk/react';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <main className={!isLanding ? "page" : ""}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <>
                <Show when="signed-in">
                  <Dashboard />
                </Show>
                <Show when="signed-out">
                  <Navigate to="/" replace />
                </Show>
              </>
            } 
          />
          <Route 
            path="/results" 
            element={
              <>
                <Show when="signed-in">
                  <Results />
                </Show>
                <Show when="signed-out">
                  <Navigate to="/" replace />
                </Show>
              </>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={
            <div className="page-center">
              <div className="empty-state">
                <div className="empty-icon">🔌</div>
                <h2>404 - Page Not Found</h2>
                <p>The circuit is broken. We couldn't find that page.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
