import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';
import image from '../assets/658af8e0-fb7a-4442-a641-1a123cb7bfdb_1.jpeg'; // Sample image

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [empId, setEmpId] = useState('');
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!empId) {
      setError('Please enter your Employee ID');
      return;
    }
    
    const result = login(empId);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-split-layout">
        {/* Left side - Image Section */}
        <div className="login-image-section">
          {/* You can replace this with your own image */}
          <div className="login-image" aria-hidden="true">
            <img 
              src={image} 
              alt="Conference room" 
              className="login-background-image"
            />
            <div className="login-image-overlay">
              <h2>Efficient Room Booking</h2>
              <p>Manage your office spaces with our simple and effective solution</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            <h1>Conference Room Booking</h1>
            <p className="subtitle">Sign in to manage your bookings</p>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="empId">Employee ID</label>
                <input
                  type="text"
                  id="empId"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="Enter your Employee ID"
                />
                <small className="hint">Try ADMIN001 for admin access or EMP001 for user access</small>
              </div>
              
              <button type="submit" className="btn btn-primary login-btn">
                Login
              </button>
            </form>
            
            <div className="login-help">
              <p>Need help? Contact your administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;