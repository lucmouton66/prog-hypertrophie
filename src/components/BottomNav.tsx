import { NavLink } from 'react-router-dom'

const items = [
  { to: '/seances', label: 'Séances', icon: '🏋️' },
  { to: '/historique', label: 'Historique', icon: '📅' },
  { to: '/progression', label: 'Progression', icon: '📈' },
  { to: '/programme', label: 'Programme', icon: '📋' },
  { to: '/reglages', label: 'Réglages', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg justify-between px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-amber-400' : 'text-zinc-500'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
