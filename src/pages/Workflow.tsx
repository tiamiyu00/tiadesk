import { ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import Avatar from '../components/Avatar'
import { teamMembers, type Task } from '../data/mockData'

interface WorkflowProps { isDark: boolean; taskList: Task[] }

export default function Workflow({ isDark, taskList }: WorkflowProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const columns = [
    { id: 'Pending Review', label: 'Pending', color: '#a855f7', icon: Clock },
    { id: 'In Progress', label: 'In Progress', color: '#3b82f6', icon: ArrowRight },
    { id: 'Blocked', label: 'Blocked', color: '#ef4444', icon: AlertCircle },
    { id: 'Complete', label: 'Complete', color: '#22c55e', icon: CheckCircle },
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Workflow
        </h1>
        <p style={{ fontSize: '13px', color: textSecondary }}>
          Track work movement across the team
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {columns.map(col => {
          const colTasks = taskList.filter(t => t.status === col.id)
          const Icon = col.icon
          return (
            <div key={col.id}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', marginBottom: '10px',
                borderRadius: '10px',
                backgroundColor: col.color + (isDark ? '14' : '10'),
                border: `1px solid ${col.color + (isDark ? '30' : '25')}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Icon size={13} color={col.color} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#fafafa' : '#111827' }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  backgroundColor: col.color + '22',
                  color: col.color,
                  padding: '2px 7px', borderRadius: '10px',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {colTasks.map(task => {
                  const member = teamMembers.find(m => m.name === task.assignee)
                  return (
                    <div key={task.id} style={{
                      backgroundColor: surface, border: `1px solid ${border}`,
                      borderRadius: '10px', padding: '14px',
                      cursor: 'pointer', transition: 'border-color 0.15s, transform 0.1s',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = isDark ? '#333' : '#d1d5db'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = border
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 500, color: textPrimary, marginBottom: '8px', lineHeight: '1.4' }}>
                        {task.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {member && <Avatar initials={member.initials} color={member.color} size={22} />}
                          <span style={{ fontSize: '11.5px', color: textMuted }}>{task.assignee}</span>
                        </div>
                        <div style={{
                          fontSize: '10.5px', fontWeight: 600, color: textMuted,
                        }}>
                          {task.progress}%
                        </div>
                      </div>
                      {/* progress bar */}
                      <div style={{
                        height: '3px', borderRadius: '2px',
                        backgroundColor: isDark ? '#1f1f1f' : '#f3f4f6',
                        marginTop: '8px', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${task.progress}%`, height: '100%',
                          borderRadius: '2px', backgroundColor: col.color,
                        }} />
                      </div>
                    </div>
                  )
                })}
                {colTasks.length === 0 && (
                  <div style={{
                    padding: '20px', textAlign: 'center',
                    fontSize: '12.5px', color: textMuted,
                    border: `1px dashed ${border}`, borderRadius: '10px',
                  }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
