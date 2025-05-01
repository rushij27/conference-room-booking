import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize event
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen && 
        !event.target.closest('.mobile-menu') && 
        !event.target.closest('.mobile-menu-button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      <header className="app-header">
        <div className="logo">
          {/* Replace the src with your actual logo */}
          <img 
            src="/header.png" 
            alt="Conference Room Booking Logo" 
            className="logo-image" 
          />
        </div>
        
        {/* Desktop Navigation */}
        {currentUser.isAdmin && (
          <nav className="main-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            
            <Link 
              to="/users" 
              className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
            >
              User Management
            </Link>
          </nav>
        )}
        
        {/* Desktop User Info */}
        <div className="user-info">
          {currentUser && (
            <div className="user-dropdown">
              <div className="user-icon" onClick={toggleDropdown}>
                <span>{currentUser.name}</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button 
                    className="btn btn-outline btn-highlight" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </header>
      
      {/* Mobile Menu */}
     {isMobile && <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {currentUser.isAdmin && (
          <>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link 
              to="/users" 
              className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              User Management
            </Link>
            <Link 
              to="/" 
              className={`nav-link`}
              style={{ color: 'red' }}
              onClick={handleLogout}
            >
              Logout
            </Link>
          </>
        )}
      </div>}
    </>
  );
};

export default Header;