import {
  LayoutDashboard, Users, CheckSquare, GitBranch,
  FileText, Sparkles, Network, Bell, Settings,
  UserCircle,
} from 'lucide-react'
import type { PageType } from '../App'
import type { UserProfile } from '../pages/Profile'

interface SidebarProps {
  isDark: boolean
  currentPage: PageType
  onNavigate: (page: PageType) => void
  alertCount: number
  taskCount: number
  profile: UserProfile
}

interface NavItem {
  id: PageType
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  badge?: number
}

const mainItems: NavItem[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'team-status', label: 'Team status', icon: Users            },
  { id: 'tasks',       label: 'Tasks',        icon: CheckSquare      },
  { id: 'workflow',    label: 'Workflow',     icon: GitBranch        },
]

const opsItems: NavItem[] = [
  { id: 'handovers',    label: 'Handovers',    icon: FileText    },
  { id: 'ai-summaries', label: 'AI summaries', icon: Sparkles    },
  { id: 'hierarchy',    label: 'Hierarchy',    icon: Network     },
  { id: 'alerts',       label: 'Alerts',       icon: Bell        },
]

const accountItems: NavItem[] = [
  { id: 'profile',  label: 'My Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings',   icon: Settings   },
]

export default function Sidebar({ isDark, currentPage, onNavigate, alertCount, taskCount, profile }: SidebarProps) {
  const bg = isDark ? '#0d0d0d' : '#ffffff'
  const border = isDark ? '#1a1a1a' : '#e5e7eb'
  const labelColor = isDark ? '#404040' : '#9ca3af'
  const textColor = isDark ? '#a3a3a3' : '#6b7280'
  const textHover = isDark ? '#fafafa' : '#111827'
  const activeText = isDark ? '#fafafa' : '#111827'
  const activeBg = isDark ? '#1a1a1a' : '#f0f4ff'

  const renderItems = (items: NavItem[]) =>
    items.map((item) => {
      const isActive = currentPage === item.id
      const Icon = item.icon
      const badgeCount = item.id === 'alerts' ? alertCount : item.id === 'tasks' ? taskCount : item.badge

      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '7px 12px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            fontSize: '13.5px', fontWeight: isActive ? 500 : 400,
            color: isActive ? activeText : textColor,
            backgroundColor: isActive ? activeBg : 'transparent',
            transition: 'all 0.15s', position: 'relative', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#f9fafb'
              e.currentTarget.style.color = textHover
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = textColor
            }
          }}
        >
          {isActive && (
            <span style={{
              position: 'absolute', left: 0, top: '20%', height: '60%',
              width: '3px', borderRadius: '0 2px 2px 0', backgroundColor: '#3b82f6',
            }} />
          )}
          <Icon size={15} strokeWidth={isActive ? 2 : 1.7} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '10px',
              backgroundColor: item.id === 'alerts'
                ? (isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2')
                : (isDark ? '#1f1f1f' : '#f3f4f6'),
              color: item.id === 'alerts'
                ? (isDark ? '#f87171' : '#dc2626')
                : (isDark ? '#737373' : '#6b7280'),
            }}>
              {badgeCount}
            </span>
          )}
        </button>
      )
    })

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: labelColor, padding: '0 12px 6px',
    }}>
      {text}
    </div>
  )

  return (
    <div style={{
      width: '210px', flexShrink: 0,
      backgroundColor: bg, borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px 16px 14px', borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: '#3b82f6', boxShadow: '0 0 6px #3b82f680',
        }} />
        <span style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#fafafa' : '#111827', letterSpacing: '-0.3px' }}>
          Workspace
        </span>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ marginBottom: '20px' }}>
          {sectionLabel('Main')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>{renderItems(mainItems)}</div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          {sectionLabel('Ops')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>{renderItems(opsItems)}</div>
        </div>
        <div>
          {sectionLabel('Account')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>{renderItems(accountItems)}</div>
        </div>
      </div>

      {/* Profile footer */}
      <button
        onClick={() => onNavigate('profile')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 14px', borderTop: `1px solid ${border}`,
          background: 'none', border: 'none', cursor: 'pointer', width: '100%',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#f9fafb'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
          backgroundColor: profile.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11.5px', fontWeight: 700, color: '#fff',
        }}>
          {profile.initials}
        </div>
        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: isDark ? '#fafafa' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile.name}
          </div>
          <div style={{ fontSize: '11px', color: isDark ? '#525252' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile.role}
          </div>
        </div>
      </button>
    </div>
  )
}
