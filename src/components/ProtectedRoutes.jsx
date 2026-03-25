// src/components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';

// Component for admin-only routes
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const { isInTelegram } = useTelegram();

  if (!isAuthenticated) {
    // In Telegram: redirect to the Telegram auth entry point instead of /login
    return <Navigate to={isInTelegram ? '/telegram' : '/login'} replace />;
  }

  if (!currentUser.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Component for authenticated user routes
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isInTelegram } = useTelegram();

  if (!isAuthenticated) {
    // In Telegram: go through Telegram auth flow; otherwise use normal login
    return <Navigate to={isInTelegram ? '/telegram' : '/login'} replace />;
  }

  return children;
};