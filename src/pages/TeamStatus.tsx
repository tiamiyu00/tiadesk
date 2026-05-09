import StatusBadge from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import { teamMembers, type StatusType } from '../data/mockData'

interface TeamStatusProps { isDark: boolean }

const statusOrder: StatusType[] = ['Active', 'Focus', 'Meeting', 'Blocked', 'Offline']

export default function TeamStatus({ isDark }: TeamStatusProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const counts = statusOrder.reduce((acc, s) => {
    acc[s] = teamMembers.filter(m => m.status === s).length
    return acc
  }, {} as Record<StatusType, number>)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Team Status
        </h1>
        <p style={{ fontSize: '13px', color: textSecondary }}>
          {teamMembers.length} members · {counts['Active'] + counts['Focus'] + counts['Meeting']} active now
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {statusOrder.map(s => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', borderRadius: '10px',
            backgroundColor: isDark ? '#111111' : '#ffffff',
            border: `1px solid ${border}`,
          }}>
            <StatusBadge status={s} isDark={isDark} size="sm" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{counts[s]}</span>
          </div>
        ))}
      </div>

      {/* Team grid */}
      <div style={{
        backgroundColor: surface, border: `1px solid ${border}`,
        borderRadius: '12px', overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr',
          padding: '10px 20px',
          borderBottom: `1px solid ${border}`,
          fontSize: '11.5px', fontWeight: 600,
          color: textMuted, letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <span>Member</span>
          <span>Current Task</span>
          <span>Department</span>
          <span>Status</span>
          <span>Contact</span>
        </div>
        {teamMembers.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr',
              padding: '14px 20px',
              borderBottom: i < teamMembers.length - 1 ? `1px solid ${border}` : 'none',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar initials={m.initials} color={m.color} size={34} />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: textMuted }}>{m.role}</div>
              </div>
            </div>
            <div style={{
              fontSize: '12.5px', color: textSecondary,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {m.task}
            </div>
            <span style={{ fontSize: '12.5px', color: textSecondary }}>{m.department}</span>
            <StatusBadge status={m.status} isDark={isDark} />
            <span style={{ fontSize: '12px', color: textMuted }}>{m.email}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
