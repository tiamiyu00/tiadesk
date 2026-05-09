import { Bell, Sun, Moon } from 'lucide-react'
import type { PageType } from '../App'

interface TopNavProps {
  isDark: boolean
  currentPage: PageType
  onNavigate: (page: PageType) => void
  onToggleTheme: () => void
  alertCount: number
}

type TabItem = { id: PageType; label: string }

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Live ops' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'handovers', label: 'Handovers' },
  { id: 'reports', label: 'Reports' },
  { id: 'ai-summaries', label: 'AI summaries' },
]

export default function TopNav({ isDark, currentPage, onNavigate, onToggleTheme, alertCount }: TopNavProps) {
  const bg = isDark ? '#0d0d0d' : '#ffffff'
  const border = isDark ? '#1a1a1a' : '#e5e7eb'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'

  const activeTab = tabs.find(t => t.id === currentPage)?.id ?? 'dashboard'

  return (
    <div style={{
      backgroundColor: bg, borderBottom: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: '4px',
      height: '48px', flexShrink: 0,
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{
                padding: '4px 12px', fontSize: '13.5px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? (isDark ? '#fafafa' : '#111827') : (isDark ? '#737373' : '#6b7280'),
                background: 'none', border: 'none', cursor: 'pointer',
                borderRadius: '6px', height: '32px', position: 'relative',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
              {isActive && (
                <span style={{
                  position: 'absolute', bottom: '-8px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% - 16px)', height: '2px',
                  borderRadius: '1px', backgroundColor: '#3b82f6',
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onToggleTheme}
          title="Toggle theme"
          style={{
            background: 'none', border: `1px solid ${border}`, cursor: 'pointer',
            color: textSecondary, padding: '5px', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Bell — navigates to alerts */}
        <button
          onClick={() => onNavigate('alerts')}
          title="Alerts"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: textSecondary, padding: '4px',
            position: 'relative', display: 'flex',
            borderRadius: '7px', transition: 'color 0.15s',
          }}
        >
          <Bell size={16} strokeWidth={1.7} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: '1px', right: '1px',
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: '#3b82f6',
              border: `1.5px solid ${bg}`,
            }} />
          )}
        </button>

        {/* Avatar — navigates to settings */}
        <button
          onClick={() => onNavigate('settings')}
          title="Settings"
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: isDark ? '#1a3a2a' : '#dcfce7',
            border: `1.5px solid ${isDark ? '#22c55e40' : '#22c55e60'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#16a34a',
            cursor: 'pointer', letterSpacing: '0.02em',
            background: isDark ? '#1a3a2a' : '#dcfce7',
          }}
        >
          AO
        </button>
      </div>
    </div>
  )
}
