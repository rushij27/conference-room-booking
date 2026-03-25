import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import NotFound from './components/NotFound';
import TelegramAuthGate from './components/TelegramAuthGate';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';
import { useTelegram } from './hooks/useTelegram';
import './styles.css';

/**
 * TelegramBootstrap — zero-render component mounted once inside AuthProvider.
 *
 * Responsibilities:
 *   1. Adds a CSS class to <body> when inside Telegram for layout overrides
 *   2. Syncs Telegram theme colours as CSS custom properties so other
 *      components can reference --tg-* variables (bonus theme support)
 *
 * Authentication is NOT triggered here — it happens only on the /telegram
 * route via TelegramAuthGate, keeping auth logic in a single place.
 */
function TelegramBootstrap() {
  const { isInTelegram, themeParams } = useTelegram();

  useEffect(() => {
    if (!isInTelegram) return;

    // Mark <body> so CSS can apply Telegram-specific layout tweaks
    document.body.classList.add('telegram-webapp');

    // Sync Telegram colour palette as CSS variables for optional use in styles
    // e.g. --tg-bg-color, --tg-text-color, --tg-button-color …
    if (themeParams) {
      const root = document.documentElement;
      Object.entries(themeParams).forEach(([key, value]) => {
        root.style.setProperty(`--tg-${key.replace(/_/g, '-')}`, value);
      });
    }

    return () => {
      document.body.classList.remove('telegram-webapp');
    };
  }, [isInTelegram, themeParams]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          {/* Theme sync + body class — must be inside AuthProvider */}
          <TelegramBootstrap />

          <div className="app">
            <Routes>
              {/* ── Telegram Mini App entry point ────────────────────────── */}
              {/* Configure this URL in BotFather: /setdomain → your domain   */}
              {/* Then inline keyboard / bot button → your-domain.com/telegram */}
              <Route path="/telegram" element={<TelegramAuthGate />} />

              {/* ── Normal web routes (unchanged) ────────────────────────── */}
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

export default App;

