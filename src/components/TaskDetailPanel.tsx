import { X } from 'lucide-react'
import { useEffect } from 'react'
import Avatar from './Avatar'
import { teamMembers, type Task, type TaskStatus } from '../data/mockData'

interface TaskDetailPanelProps {
  isDark: boolean
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
  onEdit: (task: Task) => void
}

const statusColors: Record<TaskStatus, { text: string; bg: string; lightBg: string }> = {
  'In Progress': { text: '#2563eb', bg: 'rgba(59,130,246,0.12)', lightBg: '#dbeafe' },
  'Blocked': { text: '#dc2626', bg: 'rgba(239,68,68,0.12)', lightBg: '#fee2e2' },
  'Complete': { text: '#16a34a', bg: 'rgba(34,197,94,0.12)', lightBg: '#dcfce7' },
  'Pending Review': { text: '#7c3aed', bg: 'rgba(124,58,237,0.12)', lightBg: '#ede9fe' },
}

const priorityColors = {
  High: { text: '#dc2626', bg: 'rgba(239,68,68,0.12)', lightBg: '#fee2e2' },
  Medium: { text: '#d97706', bg: 'rgba(234,179,8,0.12)', lightBg: '#fef3c7' },
  Low: { text: '#16a34a', bg: 'rgba(34,197,94,0.12)', lightBg: '#dcfce7' },
}

export default function TaskDetailPanel({ isDark, task, onClose, onUpdate, onEdit }: TaskDetailPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  const surface2 = isDark ? '#161616' : '#f9fafb'

  const member = teamMembers.find(m => m.name === task.assignee)
  const sc = statusColors[task.status]
  const pc = priorityColors[task.priority]

  const adjustProgress = (delta: number) => {
    const p = Math.min(100, Math.max(0, task.progress + delta))
    onUpdate({ ...task, progress: p, status: p === 100 ? 'Complete' : task.status })
  }

  const setStatus = (s: TaskStatus) => {
    onUpdate({ ...task, status: s, progress: s === 'Complete' ? 100 : task.progress })
  }

  const sectionLabel: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: textMuted,
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px',
  }

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 900 }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px',
        backgroundColor: surface, borderLeft: `1px solid ${border}`,
        zIndex: 901, display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: `1px solid ${border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: textPrimary, marginBottom: '10px', lineHeight: '1.4' }}>
              {task.title}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11.5px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
                backgroundColor: isDark ? sc.bg : sc.lightBg, color: sc.text,
              }}>
                {task.status}
              </span>
              <span style={{
                fontSize: '11.5px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
                backgroundColor: isDark ? pc.bg : pc.lightBg, color: pc.text,
              }}>
                {task.priority}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: textMuted, padding: '2px', display: 'flex', flexShrink: 0,
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Progress */}
          <div>
            <div style={sectionLabel}>Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ flex: 1, height: '8px', borderRadius: '4px', backgroundColor: isDark ? '#1f1f1f' : '#f3f4f6', overflow: 'hidden' }}>
                <div style={{
                  width: `${task.progress}%`, height: '100%', borderRadius: '4px',
                  backgroundColor: task.progress === 100 ? '#22c55e' : task.progress > 60 ? '#3b82f6' : '#f59e0b',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, minWidth: '38px', textAlign: 'right' }}>
                {task.progress}%
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[-25, -10, 10, 25].map(delta => (
                <button
                  key={delta}
                  onClick={() => adjustProgress(delta)}
                  style={{
                    padding: '6px 4px', borderRadius: '7px',
                    border: `1px solid ${border}`,
                    backgroundColor: delta < 0
                      ? (isDark ? '#161616' : '#f9fafb')
                      : (isDark ? 'rgba(59,130,246,0.08)' : '#eff6ff'),
                    color: delta < 0 ? textSecondary : '#3b82f6',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                    transition: 'all 0.12s',
                  }}
                >
                  {delta > 0 ? '+' : ''}{delta}%
                </button>
              ))}
            </div>
          </div>

          {/* Change Status */}
          <div>
            <div style={sectionLabel}>Change Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {(['Pending Review', 'In Progress', 'Blocked', 'Complete'] as TaskStatus[]).map(s => {
                const c = statusColors[s]
                const isActive = task.status === s
                return (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    padding: '8px 10px', borderRadius: '8px',
                    border: `1px solid ${isActive ? c.text + '50' : border}`,
                    backgroundColor: isActive ? (isDark ? c.bg : c.lightBg) : 'transparent',
                    color: isActive ? c.text : textSecondary,
                    fontSize: '12.5px', fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Assignee */}
          {member && (
            <div>
              <div style={sectionLabel}>Assigned To</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '9px', backgroundColor: surface2,
              }}>
                <Avatar initials={member.initials} color={member.color} size={32} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: textMuted }}>{member.role}</div>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div>
            <div style={sectionLabel}>Details</div>
            <div style={{
              borderRadius: '9px', border: `1px solid ${border}`, overflow: 'hidden',
            }}>
              {[
                { label: 'Owner', value: task.owner },
                { label: 'Reviewer', value: task.reviewer },
                { label: 'Deadline', value: new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Dependencies', value: task.dependencies.length > 0 ? `${task.dependencies.length} task(s)` : 'None' },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
                }}>
                  <span style={{ fontSize: '13px', color: textSecondary }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <div style={sectionLabel}>Description</div>
              <p style={{
                fontSize: '13.5px', color: textSecondary, lineHeight: '1.65', margin: 0,
                padding: '12px 14px', borderRadius: '9px',
                backgroundColor: surface2, border: `1px solid ${border}`,
              }}>
                {task.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 20px', borderTop: `1px solid ${border}`,
          display: 'flex', gap: '8px', flexShrink: 0,
        }}>
          <button onClick={() => onEdit(task)} style={{
            flex: 1, padding: '9px', borderRadius: '8px',
            border: `1px solid ${border}`, backgroundColor: surface2,
            fontSize: '13.5px', color: textSecondary, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>
            Edit Task
          </button>
          <button onClick={() => {
            onUpdate({ ...task, status: 'Complete', progress: 100 })
            onClose()
          }} style={{
            flex: 1, padding: '9px', borderRadius: '8px',
            border: 'none', backgroundColor: '#22c55e',
            fontSize: '13.5px', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>
            Mark Complete
          </button>
        </div>
      </div>
    </>
  )
}
