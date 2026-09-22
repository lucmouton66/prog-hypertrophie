import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// HashRouter (plutôt que BrowserRouter) : GitHub Pages ne sait pas servir
// index.html pour une route profonde rechargée directement (/seances/xyz) —
// avec un hash (#/seances/xyz), le serveur ne voit toujours que la racine.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
