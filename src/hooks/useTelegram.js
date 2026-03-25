import { useMemo } from 'react';
import {
  isTelegramWebApp,
  getTelegramWebApp,
  getTelegramInitData,
  getTelegramUserUnsafe,
  getTelegramThemeParams,
  triggerHapticFeedback,
} from '../utils/telegram';

/**
 * useTelegram — React hook exposing the Telegram WebApp context.
 *
 * @returns {{
 *   isInTelegram: boolean,
 *   tg: object | null,
 *   initData: string | null,
 *   user: object | null,      // ⚠️ display-only, NOT verified
 *   themeParams: object | null,
 *   haptic: (style?: string) => void,
 * }}
 *
 * All values are derived from window.Telegram.WebApp which is static after
 * the Telegram client injects it — useMemo with an empty deps array is safe.
 */
export const useTelegram = () =>
  useMemo(() => ({
    isInTelegram: isTelegramWebApp(),
    tg: getTelegramWebApp(),

    /** Raw initData string. Send to backend as-is for HMAC verification. */
    initData: getTelegramInitData(),

    /**
     * Telegram user fields (id, first_name, last_name, username, …).
     * ⚠️ NOT verified — for display only. Trust only backend-issued session data.
     */
    user: getTelegramUserUnsafe(),

    /** Telegram colour theme (bg_color, text_color, button_color, …). */
    themeParams: getTelegramThemeParams(),

    /** Trigger haptic feedback. No-op outside Telegram. */
    haptic: triggerHapticFeedback,
  }), []);
