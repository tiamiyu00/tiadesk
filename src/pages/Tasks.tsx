import { useState } from 'react'
import { Plus } from 'lucide-react'
import Avatar from '../components/Avatar'
import TaskModal from '../components/TaskModal'
import TaskDetailPanel from '../components/TaskDetailPanel'
import { type Task, type TaskStatus, type Priority, type TeamMember } from '../data/mockData'

interface TasksProps {
  isDark: boolean
  taskList: Task[]
  members: TeamMember[]
  onAddTask: (task: Task) => void
  onUpdateTask: (task: Task) => void
}

const priorityColors: Record<Priority, { text: string; bg: string; darkBg: string }> = {
  High: { text: '#dc2626', bg: '#fee2e2', darkBg: 'rgba(239,68,68,0.12)' },
  Medium: { text: '#d97706', bg: '#fef3c7', darkBg: 'rgba(234,179,8,0.12)' },
  Low: { text: '#16a34a', bg: '#dcfce7', darkBg: 'rgba(34,197,94,0.12)' },
}

const statusColors: Record<TaskStatus, { text: string; bg: string; darkBg: string }> = {
  'In Progress': { text: '#2563eb', bg: '#dbeafe', darkBg: 'rgba(59,130,246,0.12)' },
  'Blocked': { text: '#dc2626', bg: '#fee2e2', darkBg: 'rgba(239,68,68,0.12)' },
  'Complete': { text: '#16a34a', bg: '#dcfce7', darkBg: 'rgba(34,197,94,0.12)' },
  'Pending Review': { text: '#7c3aed', bg: '#ede9fe', darkBg: 'rgba(124,58,237,0.12)' },
}

function ProgressRing({ value }: { value: number }) {
  const r = 14
  const circ = 2 * Math.PI * r
  const color = value === 100 ? '#22c55e' : value > 60 ? '#3b82f6' : '#f59e0b'
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${(value / 100) * circ} ${circ}`}
        strokeLinecap="round" transform="rotate(-90 18 18)"
      />
      <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{value}%</text>
    </svg>
  )
}

export default function Tasks({ isDark, taskList, members, onAddTask, onUpdateTask }: TasksProps) {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  const filterBg = isDark ? '#1a1a1a' : '#f3f4f6'

  const filters: (TaskStatus | 'all')[] = ['all', 'In Progress', 'Blocked', 'Pending Review', 'Complete']
  const filtered = filter === 'all' ? taskList : taskList.filter(t => t.status === filter)

  const openEdit = (task: Task) => {
    setSelectedTask(null)
    setEditTask(task)
    setShowModal(true)
  }

  const startTitleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const commitTitleEdit = (task: Task) => {
    if (editingTitle.trim() && editingTitle.trim() !== task.title) {
      onUpdateTask({ ...task, title: editingTitle.trim() })
    }
    setEditingId(null)
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Tasks
          </h1>
          <p style={{ fontSize: '13px', color: textSecondary }}>
            {taskList.length} tasks · {taskList.filter(t => t.status === 'Blocked').length} blocked
          </p>
        </div>
        <button
          onClick={() => { setEditTask(null); setShowModal(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px', border: 'none',
            backgroundColor: '#3b82f6', color: '#fff', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '6px', marginBottom: '16px',
        padding: '4px', backgroundColor: filterBg,
        borderRadius: '10px', width: 'fit-content',
      }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 12px', borderRadius: '7px', border: 'none',
              fontSize: '12.5px', fontWeight: filter === f ? 500 : 400,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              backgroundColor: filter === f ? (isDark ? '#262626' : '#fff') : 'transparent',
              color: filter === f ? textPrimary : textSecondary,
              boxShadow: filter === f ? `0 1px 3px ${isDark ? '#00000060' : '#0000001a'}` : 'none',
            }}
          >
            {f === 'all' ? `All tasks (${taskList.length})` : `${f} (${taskList.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 90px 80px',
          padding: '10px 20px', borderBottom: `1px solid ${border}`,
          fontSize: '11.5px', fontWeight: 600, color: textMuted,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <span>Task</span>
          <span>Assignee</span>
          <span>Status</span>
          <span>Deadline</span>
          <span>Priority</span>
          <span>Progress</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: textMuted, fontSize: '13.5px' }}>
            No tasks match this filter.
          </div>
        ) : (
          filtered.map((task, i) => {
            const sc = statusColors[task.status]
            const pc = priorityColors[task.priority]
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 90px 80px',
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : 'none',
                  alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  {editingId === task.id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={() => commitTitleEdit(task)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitTitleEdit(task)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontSize: '13.5px', fontWeight: 500, color: textPrimary,
                        background: 'none', border: 'none', outline: 'none',
                        borderBottom: `1px solid #3b82f6`, width: '100%',
                        padding: '0 0 2px', fontFamily: 'inherit', marginBottom: '3px',
                      }}
                    />
                  ) : (
                    <div
                      style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary, marginBottom: '3px', cursor: 'text' }}
                      onDoubleClick={e => startTitleEdit(task, e)}
                      title="Double-click to rename"
                    >
                      {task.title}
                    </div>
                  )}
                  <div style={{ fontSize: '11.5px', color: textMuted }}>
                    Owner: {task.owner} · Reviewer: {task.reviewer}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar initials={task.assigneeInitials} color={task.assigneeColor} size={26} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>{task.assignee}</span>
                </div>
                <div>
                  <span style={{
                    fontSize: '11.5px', fontWeight: 500, padding: '3px 8px', borderRadius: '6px',
                    backgroundColor: isDark ? sc.darkBg : sc.bg, color: sc.text,
                  }}>
                    {task.status}
                  </span>
                </div>
                <span style={{ fontSize: '12.5px', color: textSecondary }}>
                  {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <div>
                  <span style={{
                    fontSize: '11.5px', fontWeight: 500, padding: '3px 8px', borderRadius: '6px',
                    backgroundColor: isDark ? pc.darkBg : pc.bg, color: pc.text,
                  }}>
                    {task.priority}
                  </span>
                </div>
                <ProgressRing value={task.progress} />
              </div>
            )
          })
        )}
      </div>

      {/* Modals & panels */}
      {showModal && (
        <TaskModal
          isDark={isDark}
          members={members}
          editTask={editTask ?? undefined}
          onClose={() => { setShowModal(false); setEditTask(null) }}
          onSubmit={editTask ? onUpdateTask : onAddTask}
        />
      )}
      {selectedTask && (
        <TaskDetailPanel
          isDark={isDark}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            onUpdateTask(updated)
            setSelectedTask(updated)
          }}
          onEdit={(task) => { openEdit(task) }}
        />
      )}
    </div>
  )
}
