import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import NotFound from './components/NotFound';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';
import './styles.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users" 
                element={
                  <AdminRoute>
                    <>
                      <Header />
                      <UserManagement />
                    </>
                  </AdminRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="*" 
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <NotFound />
                    </>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
