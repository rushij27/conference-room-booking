import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useAuth } from '../hooks/useAuth';
import '../styles/TelegramAuthGate.css';

/**
 * TelegramAuthGate — entry-point component mounted at the /telegram route.
 *
 * Authentication flow:
 *   1. App is NOT inside Telegram  →  redirect to /login (normal web flow)
 *   2. User is already authenticated  →  redirect to /dashboard
 *   3. initData present, status idle  →  trigger loginWithTelegram()
 *      a. Success  →  AuthContext navigates to /dashboard
 *      b. Error    →  Show error screen with hint to reopen via Telegram
 *
 * This component renders nothing in the happy path — it delegates all UI
 * to the existing app once authentication succeeds.
 */
const TelegramAuthGate = () => {
  const navigate = useNavigate();
  const { isInTelegram, initData } = useTelegram();
  const {
    isAuthenticated,
    loginWithTelegram,
    telegramAuthStatus,
    telegramAuthError,
  } = useAuth();

  useEffect(() => {
    // ── Guard: not in Telegram ────────────────────────────────────────────
    if (!isInTelegram) {
      navigate('/login', { replace: true });
      return;
    }

    // ── Already authenticated ────────────────────────────────────────────
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // ── Kick off auth (once — prevent concurrent or repeated calls) ──────
    if (initData && telegramAuthStatus === 'idle') {
      loginWithTelegram(initData);
    }
  }, [isInTelegram, initData, isAuthenticated, telegramAuthStatus, loginWithTelegram, navigate]);

  // Rendering nothing while redirect is in flight
  if (!isInTelegram || isAuthenticated) return null;

  // ── Error state ──────────────────────────────────────────────────────────
  if (telegramAuthStatus === 'error') {
    return (
      <div className="tg-auth-screen tg-auth-error-screen" role="alert">
        <div className="tg-auth-card">
          <div className="tg-auth-icon tg-auth-icon--error" aria-hidden="true">
            ⚠️
          </div>
          <h2 style={{ color: 'var(--tg-theme-text-color, #fff)', margin: 0 }}>
            Authentication Failed
          </h2>
          <p className="tg-auth-message">
            {telegramAuthError || 'Unable to verify your Telegram identity.'}
          </p>
          <p className="tg-auth-hint">
            Please close this window and reopen the app via Telegram.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading / idle state ─────────────────────────────────────────────────
  return (
    <div className="tg-auth-screen tg-auth-loading-screen">
      <div className="tg-auth-card">
        <div className="tg-auth-spinner" aria-label="Authenticating…" role="status" />
        <p className="tg-auth-message">Authenticating with Telegram…</p>
      </div>
    </div>
  );
};

export default TelegramAuthGate;
