/**
 * telegram.js — Telegram WebApp SDK utility helpers
 *
 * All functions are safe to call outside of Telegram (they return null / no-ops).
 * The SDK is loaded via <script src="https://telegram.org/js/telegram-web-app.js">
 * in index.html, which populates window.Telegram.WebApp before React boots.
 */

/**
 * Returns true when the app is running inside a Telegram WebApp container.
 * A non-empty initData string is the reliable signal that the SDK injected
 * launch parameters — a bare browser opening won't have it.
 */
export const isTelegramWebApp = () =>
  typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData;

/**
 * Returns the Telegram WebApp instance, or null when not in Telegram.
 */
export const getTelegramWebApp = () =>
  (typeof window !== 'undefined' ? window.Telegram?.WebApp ?? null : null);

/**
 * Initialize the Telegram WebApp SDK.
 * - Signals that the app is ready to receive events (tg.ready())
 * - Expands to full viewport height (tg.expand())
 * - Hides Telegram's built-in MainButton / BackButton so our own UI shows cleanly
 *
 * Call this as early as possible (e.g. from main.jsx), before React renders.
 * Safe to call when not in Telegram — it detects the environment itself.
 */
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.ready();
  tg.expand();

  // Hide Telegram-controlled UI chrome — the app renders its own navigation
  tg.MainButton?.hide();
  tg.BackButton?.hide();
};

/**
 * Returns the raw initData query string supplied by the Telegram client.
 * This string must be sent to the backend for HMAC-SHA256 verification.
 * Returns null when not in Telegram.
 */
export const getTelegramInitData = () =>
  getTelegramWebApp()?.initData ?? null;

/**
 * Returns the Telegram user object from initDataUnsafe.
 *
 * ⚠️  FOR DISPLAY PURPOSES ONLY.
 *     This data is NOT cryptographically verified on the client.
 *     Never use it for access-control decisions — always rely on the
 *     backend-verified session after initData validation.
 */
export const getTelegramUserUnsafe = () =>
  getTelegramWebApp()?.initDataUnsafe?.user ?? null;

/**
 * Returns Telegram's theme params object (colours, etc.) for optional
 * CSS variable syncing. Returns null when not in Telegram.
 */
export const getTelegramThemeParams = () =>
  getTelegramWebApp()?.themeParams ?? null;

/**
 * Trigger haptic feedback via the Telegram client.
 * No-op when called outside of Telegram.
 *
 * @param {'light'|'medium'|'heavy'|'rigid'|'soft'} style
 */
export const triggerHapticFeedback = (style = 'light') =>
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
