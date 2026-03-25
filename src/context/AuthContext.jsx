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

  // Telegram auth state: 'idle' | 'loading' | 'success' | 'error'
  const [telegramAuthStatus, setTelegramAuthStatus] = useState('idle');
  const [telegramAuthError, setTelegramAuthError] = useState(null);

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
    setTelegramAuthStatus('idle');
    setTelegramAuthError(null);
    localStorage.removeItem('conferenceBookingCurrentUser');
    localStorage.removeItem('conferenceBookingToken');
    navigate('/login');
  };

  /**
   * loginWithTelegram — authenticate via Telegram initData.
   *
   * Production path (VITE_BACKEND_URL is set):
   *   POST /api/auth/telegram
   *   Header: X-Telegram-Init-Data: <raw initData string>
   *   Expects response: { user, token }
   *
   *   The backend MUST:
   *     1. Parse initData as URL query params
   *     2. Remove the 'hash' field and sort remaining params alphabetically
   *     3. Build data_check_string: join key=value pairs with '\n'
   *     4. Derive secret_key = HMAC-SHA256(botToken, 'WebAppData')
   *     5. Compute HMAC-SHA256(data_check_string, secret_key)
   *     6. Compare to the hash field (constant-time compare to prevent timing attacks)
   *     7. Reject if auth_date is older than 1 hour (replay-attack protection)
   *     8. Issue a JWT / session cookie for the verified user
   *
   * Dev / demo fallback (no VITE_BACKEND_URL):
   *   Uses initDataUnsafe to create a local user.
   *   ⚠️  NOT SECURE — never use in production without a real backend.
   */
  const loginWithTelegram = async (initData) => {
    if (telegramAuthStatus === 'loading') return; // prevent concurrent calls
    setTelegramAuthStatus('loading');
    setTelegramAuthError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (backendUrl) {
        // ── Production: backend verifies HMAC signature ─────────────────
        const response = await fetch(`${backendUrl}/api/auth/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Raw initData forwarded for server-side HMAC verification
            'X-Telegram-Init-Data': initData,
          },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.message || `Server error ${response.status}`);
        }

        const { user, token } = await response.json();

        if (token) {
          localStorage.setItem('conferenceBookingToken', token);
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('conferenceBookingCurrentUser', JSON.stringify(user));
      } else {
        // ── Dev/demo fallback: client-side only ──────────────────────────
        // ⚠️  initDataUnsafe is NOT cryptographically verified here.
        //     Set VITE_BACKEND_URL to enable proper backend HMAC verification.

        // Minimal replay-attack guard: reject sessions older than 1 hour
        const params = new URLSearchParams(initData);
        const authDate = parseInt(params.get('auth_date'), 10);
        const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
        if (!authDate || ageSeconds > 3600) {
          throw new Error('Telegram session expired. Please reopen the app.');
        }

        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!tgUser) {
          throw new Error(
            'No Telegram user data available. Set VITE_BACKEND_URL for production.'
          );
        }

        const telegramUser = {
          empId: `TG_${tgUser.id}`,
          name:
            [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') ||
            tgUser.username ||
            `TG User ${tgUser.id}`,
          isAdmin: false,
          telegramId: tgUser.id,
          source: 'telegram',
        };

        // Register in local user list if first time
        setUsers((prev) => {
          if (prev.some((u) => u.empId === telegramUser.empId)) return prev;
          const updated = [...prev, telegramUser];
          saveUsers(updated);
          return updated;
        });

        setCurrentUser(telegramUser);
        setIsAuthenticated(true);
        localStorage.setItem(
          'conferenceBookingCurrentUser',
          JSON.stringify(telegramUser)
        );
      }

      setTelegramAuthStatus('success');
      navigate('/dashboard');
    } catch (err) {
      setTelegramAuthStatus('error');
      setTelegramAuthError(err.message || 'Telegram authentication failed');
    }
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
    deleteUser,
    // Telegram auth
    loginWithTelegram,
    telegramAuthStatus,
    telegramAuthError,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};