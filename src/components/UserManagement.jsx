import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import UserForm from './UserForm';

const UserManagement = () => {
  const { users, deleteUser } = useAuth();
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const handleDeleteUser = (empId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = deleteUser(empId);
      if (result.success) {
        setSuccess('User deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <button 
          className="btn btn-primary"
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.empId}>
                <td>{user.empId}</td>
                <td>{user.name}</td>
                <td>{user.isAdmin ? 'Administrator' : 'User'}</td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="btn btn-icon"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-icon"
                      onClick={() => handleDeleteUser(user.empId)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isUserFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <UserForm 
              user={editingUser}
              onClose={handleCloseUserForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;