import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const UserForm = ({ user, onClose }) => {
  const { addUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    isAdmin: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If editing an existing user, populate form fields
  useEffect(() => {
    if (user) {
      setFormData({
        empId: user.empId,
        name: user.name,
        isAdmin: user.isAdmin
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input
    if (!formData.empId) {
      setError('Please enter an Employee ID');
      return;
    }

    if (!formData.name) {
      setError('Please enter a name');
      return;
    }

    // Submit form
    const result = user 
      ? updateUser(formData)
      : addUser(formData);

    if (result.success) {
      setSuccess(user ? 'User updated!' : 'User created!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="user-form">
      <div className="form-header">
        <h2>{user ? 'Edit User' : 'Add User'}</h2>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="empId">Employee ID</label>
          <input
            type="text"
            id="empId"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
            placeholder="Enter employee ID"
            disabled={user !== null} // Disable editing empId for existing users
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="form-group checkbox-item">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          <label htmlFor="isAdmin">Administrator privileges</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {user ? 'Update' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;