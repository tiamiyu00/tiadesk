import type { StatusType } from '../data/mockData'

interface StatusBadgeProps {
  status: StatusType
  isDark: boolean
  size?: 'sm' | 'md'
}

export const statusConfig: Record<StatusType, { lightBg: string; darkBg: string; lightText: string; darkText: string; dot: string }> = {
  Active: { lightBg: '#dcfce7', darkBg: 'rgba(34,197,94,0.13)', lightText: '#15803d', darkText: '#4ade80', dot: '#22c55e' },
  Focus: { lightBg: '#e0e7ff', darkBg: 'rgba(99,102,241,0.13)', lightText: '#4338ca', darkText: '#818cf8', dot: '#6366f1' },
  Blocked: { lightBg: '#fee2e2', darkBg: 'rgba(239,68,68,0.13)', lightText: '#dc2626', darkText: '#f87171', dot: '#ef4444' },
  Meeting: { lightBg: '#fef9c3', darkBg: 'rgba(234,179,8,0.13)', lightText: '#92400e', darkText: '#fbbf24', dot: '#eab308' },
  Offline: { lightBg: '#f3f4f6', darkBg: 'rgba(115,115,115,0.13)', lightText: '#6b7280', darkText: '#737373', dot: '#9ca3af' },
}

export default function StatusBadge({ status, isDark, size = 'md' }: StatusBadgeProps) {
  const cfg = statusConfig[status]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size === 'sm' ? '4px' : '5px',
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: '20px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 500,
      backgroundColor: isDark ? cfg.darkBg : cfg.lightBg,
      color: isDark ? cfg.darkText : cfg.lightText,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: size === 'sm' ? '5px' : '6px',
        height: size === 'sm' ? '5px' : '6px',
        borderRadius: '50%',
        backgroundColor: cfg.dot,
        flexShrink: 0,
      }} />
      {status}
    </span>
  )
}
