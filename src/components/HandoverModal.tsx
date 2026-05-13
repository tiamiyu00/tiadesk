import { useState } from 'react'
import Modal from './Modal'
import { type HandoverNote, type TeamMember } from '../data/mockData'

interface HandoverModalProps {
  isDark: boolean
  onClose: () => void
  onSubmit: (handover: HandoverNote) => void
  members: TeamMember[]
}

export default function HandoverModal({ isDark, onClose, onSubmit, members }: HandoverModalProps) {
  const [to, setTo] = useState(members[1]?.name ?? members[0]?.name ?? '')
  const [task, setTask] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<HandoverNote['priority']>('Medium')
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
    if (!task.trim()) e.task = 'Task name is required'
    if (!notes.trim()) e.notes = 'Notes are required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const fromMember = members[0]
    const toMember = members.find(m => m.name === to) ?? members[1]
    onSubmit({
      id: `h${Date.now()}`,
      from: fromMember.name,
      fromInitials: fromMember.initials,
      fromColor: fromMember.color,
      to: toMember.name,
      toInitials: toMember.initials,
      toColor: toMember.color,
      task: task.trim(),
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
      status: 'Pending',
      priority,
    })
    onClose()
  }

  return (
    <Modal isDark={isDark} title="New Handover" onClose={onClose}>
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* From (read-only) */}
        <div>
          <label style={label}>From (you)</label>
          <div style={{ ...inputStyle, color: textSecondary, border: 'none', backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6' }}>
            {members[0].name} — {members[0].role}
          </div>
        </div>

        {/* To */}
        <div>
          <label style={label}>Hand Over To *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={to} onChange={e => setTo(e.target.value)}>
            {members.slice(1).map(m => (
              <option key={m.id} value={m.name}>{m.name} — {m.role}</option>
            ))}
          </select>
        </div>

        {/* Task */}
        <div>
          <label style={label}>Task / Context *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.task ? '#ef4444' : border }}
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="e.g. API Spec — Section 3"
            autoFocus
          />
          {errors.task && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.task}</span>}
        </div>

        {/* Priority */}
        <div>
          <label style={label}>Priority</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={priority}
            onChange={e => setPriority(e.target.value as HandoverNote['priority'])}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={label}>Handover Notes *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '110px', lineHeight: '1.6', borderColor: errors.notes ? '#ef4444' : border }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Provide context, current state, and what the next person needs to know..."
          />
          {errors.notes && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.notes}</span>}
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
          Submit Handover
        </button>
      </div>
    </Modal>
  )
}
