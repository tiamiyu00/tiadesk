import { TrendingUp, Users, Clock, CheckSquare } from 'lucide-react'

interface ReportsProps { isDark: boolean }

function MiniBarChart({ data, color, isDark }: { data: number[]; color: string; isDark: boolean }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          borderRadius: '3px 3px 0 0',
          backgroundColor: i === data.length - 1 ? color : color + (isDark ? '50' : '40'),
          minHeight: '4px',
          transition: 'height 0.4s ease',
        }} />
      ))}
    </div>
  )
}

export default function Reports({ isDark }: ReportsProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const weeklyPulse = [78, 82, 79, 85, 83, 88, 87]
  const weeklyCapacity = [88, 91, 89, 94, 92, 95, 94]
  const tasksCompleted = [3, 5, 4, 6, 5, 6, 4]

  const metrics = [
    {
      label: 'Avg Pulse Score', value: '87', change: '+4', positive: true,
      data: weeklyPulse, color: '#3b82f6', icon: TrendingUp, sub: 'This week',
    },
    {
      label: 'Team Capacity', value: '94%', change: '+2%', positive: true,
      data: weeklyCapacity, color: '#22c55e', icon: Users, sub: '17 of 18 online',
    },
    {
      label: 'Tasks Completed', value: '33', change: '+8', positive: true,
      data: tasksCompleted, color: '#a855f7', icon: CheckSquare, sub: 'This week',
    },
    {
      label: 'Avg Response Time', value: '1.4h', change: '-12%', positive: true,
      data: [2.1, 1.9, 1.8, 1.6, 1.5, 1.3, 1.4], color: '#f59e0b', icon: Clock, sub: 'Improving',
    },
  ]

  const departments = [
    { name: 'Engineering', pulse: 89, tasks: 12, blocked: 1 },
    { name: 'Design', pulse: 84, tasks: 4, blocked: 0 },
    { name: 'Product', pulse: 81, tasks: 6, blocked: 1 },
    { name: 'Operations', pulse: 92, tasks: 5, blocked: 0 },
    { name: 'Customer Success', pulse: 88, tasks: 3, blocked: 0 },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Reports
        </h1>
        <p style={{ fontSize: '13px', color: textSecondary }}>
          Week of 5 – 9 May 2026 · Auto-generated
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {metrics.map(m => {
          return (
            <div key={m.label} style={{
              backgroundColor: surface, border: `1px solid ${border}`,
              borderRadius: '12px', padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: textMuted, marginBottom: '6px', fontWeight: 500 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: m.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                    {m.value}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px', borderRadius: '6px',
                  backgroundColor: m.color + (isDark ? '18' : '18'),
                  fontSize: '11px', fontWeight: 600, color: m.color,
                }}>
                  {m.change}
                </div>
              </div>
              <MiniBarChart data={m.data} color={m.color} isDark={isDark} />
              <div style={{ fontSize: '11.5px', color: textMuted, marginTop: '8px' }}>{m.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Department breakdown */}
      <div style={{
        backgroundColor: surface, border: `1px solid ${border}`,
        borderRadius: '12px', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Department Breakdown</span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr',
          padding: '10px 20px', borderBottom: `1px solid ${border}`,
          fontSize: '11.5px', fontWeight: 600, color: textMuted,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <span>Department</span>
          <span>Pulse</span>
          <span>Tasks</span>
          <span>Blocked</span>
          <span>Health</span>
        </div>
        {departments.map((d, i) => (
          <div key={d.name} style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr',
            padding: '14px 20px',
            borderBottom: i < departments.length - 1 ? `1px solid ${border}` : 'none',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary }}>{d.name}</span>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: d.pulse >= 88 ? '#22c55e' : d.pulse >= 82 ? '#3b82f6' : '#f59e0b' }}>
              {d.pulse}
            </span>
            <span style={{ fontSize: '13px', color: textSecondary }}>{d.tasks}</span>
            <span style={{
              fontSize: '13px',
              color: d.blocked > 0 ? '#ef4444' : '#22c55e',
              fontWeight: d.blocked > 0 ? 600 : 400,
            }}>
              {d.blocked}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '5px', borderRadius: '3px', backgroundColor: isDark ? '#1f1f1f' : '#f3f4f6', overflow: 'hidden' }}>
                <div style={{
                  width: `${d.pulse}%`, height: '100%', borderRadius: '3px',
                  backgroundColor: d.pulse >= 88 ? '#22c55e' : d.pulse >= 82 ? '#3b82f6' : '#f59e0b',
                }} />
              </div>
              <span style={{ fontSize: '12px', color: textMuted, minWidth: '30px' }}>{d.pulse}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
