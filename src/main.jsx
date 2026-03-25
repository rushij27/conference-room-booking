import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initTelegramApp } from './utils/telegram.js'

// Initialize the Telegram WebApp SDK as early as possible — before React
// renders any components. This ensures tg.ready(), tg.expand(), and button
// hides run synchronously on the first frame inside Telegram.
// Safe to call in a normal browser — it detects the environment internally.
initTelegramApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
