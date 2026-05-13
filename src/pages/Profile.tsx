import { useState } from 'react'
import { Edit2, Save, Plus, CheckCircle, FileText, Bell, User } from 'lucide-react'
import TaskModal from '../components/TaskModal'
import type { Task, HandoverNote, Alert, TeamMember } from '../data/mockData'
import type { ToastItem } from '../components/Toast'

export interface UserProfile {
  name: string
  initials: string
  role: string
  email: string
  department: string
  bio: string
  color: string
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Your Name',
  initials: 'YN',
  role: 'Your Role',
  email: 'you@workspace.io',
  department: 'Your Department',
  bio: '',
  color: '#3b82f6',
}

export function loadStoredProfile(): UserProfile {
  try {
    const s = localStorage.getItem('tiadesk_profile')
    return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : { ...DEFAULT_PROFILE }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

const AVATAR_COLORS = [
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
  '#f43f5e', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#0ea5e9',
]

const statusColors: Record<string, string> = {
  'Complete': '#22c55e',
  'In Progress': '#3b82f6',
  'Blocked': '#ef4444',
  'Pending Review': '#a855f7',
}

interface ProfileProps {
  isDark: boolean
  profile: UserProfile
  taskList: Task[]
  handoverList: HandoverNote[]
  alertList: Alert[]
  members: TeamMember[]
  onAddTask: (t: Task) => void
  onProfileSave: (p: UserProfile) => void
  addToast: (t: Omit<ToastItem, 'id'>) => void
}

export default function Profile({
  isDark, profile, taskList, handoverList, alertList,
  members, onAddTask, onProfileSave, addToast,
}: ProfileProps) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  const inputBg = isDark ? '#0d0d0d' : '#f9fafb'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px',
    backgroundColor: inputBg, border: `1px solid ${border}`,
    borderRadius: '7px', fontSize: '13px', color: textPrimary,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  const myTasks = taskList.filter(t =>
    t.assignee.toLowerCase() === profile.name.toLowerCase() ||
    t.owner.toLowerCase() === profile.name.toLowerCase()
  )
  const myHandovers = handoverList.filter(h =>
    h.from.toLowerCase() === profile.name.toLowerCase() ||
    h.to.toLowerCase() === profile.name.toLowerCase()
  )
  const unreadAlerts = alertList.filter(a => !a.read)

  const saveProfile = () => {
    const words = draft.name.trim().split(/\s+/)
    const initials = words.map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2) || 'YN'
    const updated: UserProfile = { ...draft, name: draft.name.trim() || 'Your Name', initials }
    localStorage.setItem('tiadesk_profile', JSON.stringify(updated))
    onProfileSave(updated)
    setEditMode(false)
    addToast({ type: 'success', title: 'Profile saved', message: `Welcome, ${updated.name}` })
  }

  const startEdit = () => {
    setDraft(profile)
    setEditMode(true)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Profile card */}
      <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
        {/* Banner gradient */}
        <div style={{
          height: '88px',
          background: `linear-gradient(135deg, ${profile.color}50 0%, ${profile.color}18 100%)`,
          borderBottom: `1px solid ${border}`,
        }} />

        <div style={{ padding: '0 24px 24px' }}>
          {/* Avatar + action button row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '-38px', marginBottom: '16px' }}>
            <div style={{
              width: '76px', height: '76px', borderRadius: '50%',
              backgroundColor: profile.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-1px',
              border: `4px solid ${isDark ? '#111111' : '#ffffff'}`,
              boxShadow: `0 8px 24px ${profile.color}50`,
            }}>
              {profile.initials}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {editMode && (
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    padding: '7px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                    background: 'none', color: textSecondary, fontSize: '13px',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={editMode ? saveProfile : startEdit}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 16px', borderRadius: '8px',
                  border: editMode ? 'none' : `1px solid ${border}`,
                  backgroundColor: editMode ? '#3b82f6' : (isDark ? '#1f1f1f' : '#f3f4f6'),
                  color: editMode ? '#fff' : textPrimary,
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {editMode ? <><Save size={13} /> Save Profile</> : <><Edit2 size={13} /> Edit Profile</>}
              </button>
            </div>
          </div>

          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '5px' }}>Full Name</label>
                  <input style={inputStyle} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Your Name" autoFocus />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '5px' }}>Role</label>
                  <input style={inputStyle} value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))} placeholder="Your Role" />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '5px' }}>Email</label>
                  <input style={inputStyle} value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} placeholder="you@workspace.io" />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '5px' }}>Department</label>
                  <input style={inputStyle} value={draft.department} onChange={e => setDraft(d => ({ ...d, department: e.target.value }))} placeholder="Department" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '5px' }}>Bio</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.5' }}
                  value={draft.bio}
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  placeholder="A short bio about yourself…"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: textMuted, display: 'block', marginBottom: '8px' }}>Avatar Color</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {AVATAR_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setDraft(d => ({ ...d, color: c }))}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                        backgroundColor: c, cursor: 'pointer',
                        outline: draft.color === c ? `3px solid ${isDark ? '#fafafa' : '#111827'}` : 'none',
                        outlineOffset: '2px', transition: 'outline 0.1s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '21px', fontWeight: 800, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.4px' }}>
                {profile.name}
              </h2>
              <div style={{ fontSize: '13.5px', color: textSecondary, marginBottom: '2px' }}>{profile.role}</div>
              <div style={{ fontSize: '12.5px', color: textMuted }}>{profile.department} · {profile.email}</div>
              {profile.bio && (
                <p style={{ fontSize: '13.5px', color: textSecondary, marginTop: '14px', lineHeight: '1.65', borderTop: `1px solid ${border}`, paddingTop: '14px' }}>
                  {profile.bio}
                </p>
              )}
              {!profile.bio && profile.name === 'Your Name' && (
                <p style={{ fontSize: '13px', color: textMuted, marginTop: '12px', fontStyle: 'italic' }}>
                  Click "Edit Profile" to set up your workspace profile.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'My Tasks',     value: myTasks.length,                                       color: '#3b82f6', Icon: CheckCircle },
          { label: 'Completed',    value: myTasks.filter(t => t.status === 'Complete').length,   color: '#22c55e', Icon: CheckCircle },
          { label: 'Handovers',    value: myHandovers.length,                                    color: '#a855f7', Icon: FileText   },
          { label: 'Unread Alerts',value: unreadAlerts.length,                                   color: '#f59e0b', Icon: Bell       },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} style={{
            backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px',
            padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={17} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ fontSize: '11.5px', color: textMuted, marginTop: '2px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Tasks */}
      <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: myTasks.length > 0 ? `1px solid ${border}` : 'none',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>My Tasks</span>
          <button
            onClick={() => setShowTaskModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 13px', borderRadius: '7px', border: 'none',
              backgroundColor: '#3b82f6', color: '#fff',
              fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Plus size={13} /> Submit Task
          </button>
        </div>
        {myTasks.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center' }}>
            <User size={28} color={textMuted} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '13px', color: textMuted }}>
              No tasks linked to <strong style={{ color: textSecondary }}>{profile.name}</strong> yet.
            </div>
            <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
              Submit a task or ask a team member to assign one to you.
            </div>
          </div>
        ) : (
          myTasks.map((t, i) => (
            <div key={t.id} style={{
              padding: '13px 20px',
              borderBottom: i < myTasks.length - 1 ? `1px solid ${border}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary, marginBottom: '2px' }}>{t.title}</div>
                <div style={{ fontSize: '11.5px', color: textMuted }}>Due {t.deadline} · {t.priority} priority</div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div style={{ fontSize: '12px', color: textMuted }}>{t.progress}%</div>
                <span style={{
                  fontSize: '11.5px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
                  backgroundColor: `${statusColors[t.status] ?? '#3b82f6'}18`,
                  color: statusColors[t.status] ?? '#3b82f6',
                }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notifications */}
      <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: unreadAlerts.length > 0 ? `1px solid ${border}` : 'none' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>
            Notifications
            {unreadAlerts.length > 0 && (
              <span style={{
                marginLeft: '8px', fontSize: '11px', fontWeight: 700,
                padding: '2px 7px', borderRadius: '10px',
                backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444',
              }}>
                {unreadAlerts.length} unread
              </span>
            )}
          </span>
        </div>
        {unreadAlerts.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center' }}>
            <Bell size={28} color={textMuted} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '13px', color: textMuted }}>All caught up — no unread alerts.</div>
          </div>
        ) : (
          unreadAlerts.slice(0, 5).map((a, i) => {
            const aColor = a.type === 'error' ? '#ef4444' : a.type === 'warning' ? '#f59e0b' : a.type === 'success' ? '#22c55e' : '#3b82f6'
            return (
              <div key={a.id} style={{
                padding: '13px 20px',
                borderBottom: i < Math.min(unreadAlerts.length, 5) - 1 ? `1px solid ${border}` : 'none',
                borderLeft: `3px solid ${aColor}`,
                display: 'flex', alignItems: 'flex-start', gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '3px' }}>{a.title}</div>
                  <div style={{ fontSize: '12.5px', color: textSecondary, lineHeight: '1.5' }}>{a.message}</div>
                </div>
                <span style={{ fontSize: '11px', color: textMuted, flexShrink: 0, marginTop: '1px' }}>
                  {new Date(a.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          isDark={isDark}
          members={members}
          onClose={() => setShowTaskModal(false)}
          onSubmit={(t) => {
            onAddTask(t)
            setShowTaskModal(false)
            addToast({ type: 'success', title: 'Task submitted', message: t.title })
          }}
        />
      )}
    </div>
  )
}
