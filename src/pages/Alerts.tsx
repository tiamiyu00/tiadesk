import { AlertTriangle, XCircle, Info, CheckCircle, X } from 'lucide-react'
import { type Alert } from '../data/mockData'

interface AlertsProps {
  isDark: boolean
  alertList: Alert[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

const alertConfig = {
  error: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', lightBg: '#fff5f5', border: 'rgba(239,68,68,0.2)', label: 'Error' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', lightBg: '#fffbeb', border: 'rgba(245,158,11,0.2)', label: 'Warning' },
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', lightBg: '#eff6ff', border: 'rgba(59,130,246,0.2)', label: 'Info' },
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', lightBg: '#f0fdf4', border: 'rgba(34,197,94,0.2)', label: 'Success' },
}

export default function Alerts({ isDark, alertList, onMarkRead, onMarkAllRead }: AlertsProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  const unreadCount = alertList.filter(a => !a.read).length

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Alerts
          </h1>
          <p style={{ fontSize: '13px', color: textSecondary }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · {alertList.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px',
              border: `1px solid ${border}`, background: 'none',
              color: textSecondary, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter summary chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['error', 'warning', 'info', 'success'] as const).map(type => {
          const count = alertList.filter(a => a.type === type).length
          if (count === 0) return null
          const cfg = alertConfig[type]
          return (
            <div key={type} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: '8px',
              backgroundColor: isDark ? cfg.bg : cfg.lightBg,
              border: `1px solid ${cfg.border}`,
              fontSize: '12px', color: cfg.color, fontWeight: 500,
            }}>
              <cfg.icon size={12} />
              {count} {cfg.label}
            </div>
          )
        })}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alertList.map(alert => {
          const cfg = alertConfig[alert.type]
          const Icon = cfg.icon
          return (
            <div
              key={alert.id}
              onClick={() => onMarkRead(alert.id)}
              style={{
                display: 'flex', gap: '14px',
                backgroundColor: surface, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '16px 18px',
                opacity: alert.read ? 0.6 : 1,
                cursor: alert.read ? 'default' : 'pointer',
                transition: 'all 0.15s',
                borderLeft: `3px solid ${alert.read ? 'transparent' : cfg.color}`,
              }}
              onMouseEnter={e => {
                if (!alert.read) e.currentTarget.style.borderColor = cfg.color
              }}
              onMouseLeave={e => {
                if (!alert.read) e.currentTarget.style.borderColor = border
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px',
                backgroundColor: isDark ? cfg.bg : cfg.lightBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} color={cfg.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: textPrimary }}>
                    {alert.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    {!alert.read && (
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: cfg.color, flexShrink: 0,
                      }} />
                    )}
                    <span style={{ fontSize: '11.5px', color: textMuted }}>
                      {new Date(alert.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: textSecondary, lineHeight: '1.5', margin: '0 0 8px' }}>
                  {alert.message}
                </p>
                <span style={{
                  fontSize: '11px', fontWeight: 500, padding: '2px 7px', borderRadius: '5px',
                  backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6', color: textMuted,
                }}>
                  {alert.department}
                </span>
              </div>

              {!alert.read && (
                <button
                  onClick={e => { e.stopPropagation(); onMarkRead(alert.id) }}
                  title="Dismiss"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: textMuted, padding: '2px', display: 'flex',
                    flexShrink: 0, alignSelf: 'flex-start',
                    borderRadius: '5px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
