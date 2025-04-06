import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Conference Room Booking</h1>
      </div>
      
      {/* Navigation */}
      {currentUser && (
        <nav className="main-nav">
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          
          {currentUser.isAdmin && (
            <Link 
              to="/users" 
              className={location.pathname === '/users' ? 'active' : ''}
            >
              User Management
            </Link>
          )}
        </nav>
      )}
      
      <div className="user-info">
        {currentUser && (
          <>
            <span>{currentUser.name} ({currentUser.isAdmin ? 'Admin' : 'User'})</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;