import { Navigate, Route, Routes } from 'react-router-dom'
import { AppStoreProvider } from './store/AppStore'
import { BottomNav } from './components/BottomNav'
import { SeancesPage } from './pages/SeancesPage'
import { HistoriquePage } from './pages/HistoriquePage'
import { SessionDetailPage } from './pages/SessionDetailPage'
import { ProgressionPage } from './pages/ProgressionPage'
import { ProgrammePage } from './pages/ProgrammePage'
import { ReglagesPage } from './pages/ReglagesPage'

function App() {
  return (
    <AppStoreProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-lg">
          <Routes>
            <Route path="/" element={<Navigate to="/seances" replace />} />
            <Route path="/seances" element={<SeancesPage />} />
            <Route path="/seances/:dayId" element={<SeancesPage />} />
            <Route path="/historique" element={<HistoriquePage />} />
            <Route path="/historique/:sessionId" element={<SessionDetailPage />} />
            <Route path="/progression" element={<ProgressionPage />} />
            <Route path="/programme" element={<ProgrammePage />} />
            <Route path="/reglages" element={<ReglagesPage />} />
            <Route path="*" element={<Navigate to="/seances" replace />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </AppStoreProvider>
  )
}

export default App
