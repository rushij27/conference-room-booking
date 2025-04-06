import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // Initial sample users data
  const initialUsers = [
    { 
      empId: 'ADMIN001', 
      name: 'John Doe', 
      isAdmin: true 
    },
    { 
      empId: 'ADMIN002', 
      name: 'Jane Smith', 
      isAdmin: true 
    },
    { 
      empId: 'EMP001', 
      name: 'Mike Johnson', 
      isAdmin: false 
    },
    { 
      empId: 'EMP002', 
      name: 'Sarah Williams', 
      isAdmin: false 
    }
  ];

  // Attempt to load users from localStorage
  const loadUsers = () => {
    const savedUsers = localStorage.getItem('conferenceBookingUsers');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('conferenceBookingUsers', JSON.stringify(users));
  };

  // Initialize from localStorage or default data
  const [users, setUsers] = useState(loadUsers);
  
  // Save to localStorage when users change
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // Check for saved auth state in localStorage
  const loadAuthState = () => {
    const savedUser = localStorage.getItem('conferenceBookingCurrentUser');
    if (savedUser) {
      return {
        currentUser: JSON.parse(savedUser),
        isAuthenticated: true
      };
    }
    return {
      currentUser: null,
      isAuthenticated: false
    };
  };

  // State
  const [currentUser, setCurrentUser] = useState(loadAuthState().currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(loadAuthState().isAuthenticated);

  // Login function
  const login = (empId) => {
    const user = users.find(user => user.empId === empId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Save to localStorage
      localStorage.setItem('conferenceBookingCurrentUser', JSON.stringify(user));
      // Navigate to dashboard on successful login
      navigate('/dashboard');
      return { success: true, user };
    }
    return { success: false, message: 'Invalid Employee ID' };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Clear from localStorage
    localStorage.removeItem('conferenceBookingCurrentUser');
    // Navigate to login page
    navigate('/login');
  };

  // Add user function
  const addUser = (userData) => {
    // Check if user with same empId already exists
    if (users.some(user => user.empId === userData.empId)) {
      return { success: false, message: 'Employee ID already exists' };
    }

    const newUser = {
      empId: userData.empId,
      name: userData.name,
      isAdmin: userData.isAdmin || false
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    return { success: true, user: newUser };
  };

  // Update user function
  const updateUser = (userData) => {
    // Check if trying to update to an empId that already exists on another user
    const existingUser = users.find(user => user.empId === userData.empId && user.name !== userData.name);
    if (existingUser) {
      return { success: false, message: 'Employee ID already exists' };
    }

    const updatedUsers = users.map(user => 
      user.empId === userData.empId ? { ...user, ...userData } : user
    );
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    // If updating the current user, update currentUser state too
    if (currentUser && currentUser.empId === userData.empId) {
      setCurrentUser({ ...currentUser, ...userData });
      localStorage.setItem('conferenceBookingCurrentUser', JSON.stringify({ ...currentUser, ...userData }));
    }
    
    return { success: true };
  };

  // Delete user function
  const deleteUser = (empId) => {
    // Prevent deleting the last admin
    const admins = users.filter(user => user.isAdmin);
    const userToDelete = users.find(user => user.empId === empId);
    
    if (userToDelete && userToDelete.isAdmin && admins.length <= 1) {
      return { success: false, message: 'Cannot delete the last admin user' };
    }
    
    const updatedUsers = users.filter(user => user.empId !== empId);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    return { success: true };
  };

  // The context value
  const authContextValue = {
    users,
    currentUser,
    isAuthenticated,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};