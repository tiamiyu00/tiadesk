import { useState } from 'react'
import Modal from './Modal'
import { type Task, type TeamMember } from '../data/mockData'

interface TaskModalProps {
  isDark: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
  editTask?: Task
  members: TeamMember[]
}

export default function TaskModal({ isDark, onClose, onSubmit, editTask, members }: TaskModalProps) {
  const [title, setTitle] = useState(editTask?.title ?? '')
  const [assignee, setAssignee] = useState(editTask?.assignee ?? members[0]?.name ?? '')
  const [reviewer, setReviewer] = useState(editTask?.reviewer ?? members[1]?.name ?? '')
  const [priority, setPriority] = useState<Task['priority']>(editTask?.priority ?? 'Medium')
  const [deadline, setDeadline] = useState(editTask?.deadline ?? '2026-05-20')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const inputBg = isDark ? '#0d0d0d' : '#f9fafb'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    backgroundColor: inputBg, border: `1px solid ${border}`,
    borderRadius: '8px', fontSize: '13.5px', color: textPrimary,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  const label: React.CSSProperties = {
    fontSize: '12.5px', fontWeight: 500, color: textSecondary,
    marginBottom: '6px', display: 'block',
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!deadline) e.deadline = 'Deadline is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const member = members.find(m => m.name === assignee) ?? members[0]
    onSubmit({
      id: editTask?.id ?? `t${Date.now()}`,
      title: title.trim(),
      description: editTask?.description ?? '',
      assignee: member.name,
      assigneeInitials: member.initials,
      assigneeColor: member.color,
      priority,
      deadline,
      status: editTask?.status ?? 'In Progress',
      progress: editTask?.progress ?? 0,
      dependencies: editTask?.dependencies ?? [],
      owner: member.name,
      reviewer,
    })
    onClose()
  }

  return (
    <Modal isDark={isDark} title={editTask ? 'Edit Task' : 'New Task'} onClose={onClose} width="400px">
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={label}>Title *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.title ? '#ef4444' : border }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. API Integration Spec"
            autoFocus
          />
          {errors.title && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={label}>Assignee</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignee} onChange={e => setAssignee(e.target.value)}>
              {members.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>Reviewer</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={reviewer} onChange={e => setReviewer(e.target.value)}>
              {members.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={label}>Priority</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={priority}
              onChange={e => setPriority(e.target.value as Task['priority'])}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label style={label}>Deadline *</label>
            <input
              type="date"
              style={{ ...inputStyle, borderColor: errors.deadline ? '#ef4444' : border }}
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
            {errors.deadline && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.deadline}</span>}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: '10px',
        padding: '16px 22px', borderTop: `1px solid ${border}`,
      }}>
        <button onClick={onClose} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${border}`,
          background: 'none', fontSize: '13.5px', color: textSecondary,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Cancel
        </button>
        <button onClick={handleSubmit} style={{
          padding: '8px 20px', borderRadius: '8px', border: 'none',
          backgroundColor: '#3b82f6', fontSize: '13.5px', color: '#fff',
          fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {editTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </Modal>
  )
}
