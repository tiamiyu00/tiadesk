import { useState } from 'react'
import { User, Bell, Shield, Palette, ChevronRight, Check } from 'lucide-react'

interface SettingsProps { isDark: boolean }

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '38px', height: '22px', borderRadius: '11px', cursor: 'pointer',
        backgroundColor: value ? '#3b82f6' : '#d1d5db',
        position: 'relative', transition: 'background-color 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
        position: 'absolute', top: '3px',
        left: value ? '19px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </div>
  )
}

interface EditableFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  isDark: boolean
  border: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  isLast: boolean
}

function EditableField({ label, value, onChange, isDark, border, textPrimary, textSecondary, textMuted, isLast }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputBg = isDark ? '#0d0d0d' : '#f9fafb'

  const save = () => {
    onChange(draft.trim() || value)
    setEditing(false)
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 20px',
      borderBottom: isLast ? 'none' : `1px solid ${border}`,
    }}>
      <span style={{ fontSize: '13.5px', color: textSecondary }}>{label}</span>
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
            style={{
              padding: '5px 10px', borderRadius: '7px', border: `1px solid #3b82f6`,
              backgroundColor: inputBg, color: textPrimary,
              fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '160px',
            }}
          />
          <button onClick={save} style={{
            background: '#3b82f6', border: 'none', cursor: 'pointer',
            color: '#fff', padding: '5px 10px', borderRadius: '7px',
            fontSize: '12.5px', fontFamily: 'inherit',
          }}>
            Save
          </button>
          <button onClick={() => setEditing(false)} style={{
            background: 'none', border: `1px solid ${border}`, cursor: 'pointer',
            color: textSecondary, padding: '5px 10px', borderRadius: '7px',
            fontSize: '12.5px', fontFamily: 'inherit',
          }}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(value); setEditing(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: textPrimary, fontSize: '13.5px', fontWeight: 500,
            fontFamily: 'inherit', padding: '4px 8px', borderRadius: '6px',
          }}
        >
          {value}
          <ChevronRight size={13} color={textMuted} />
        </button>
      )}
    </div>
  )
}

export default function Settings({ isDark }: SettingsProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const [profile, setProfile] = useState({
    fullName: 'Amara Osei',
    role: 'Lead Engineer',
    email: 'amara.d@workspace.io',
    department: 'Engineering',
  })

  const [toggles, setToggles] = useState({
    blockedAlerts: true,
    dailySummary: true,
    handoverReminders: true,
    sprintWarnings: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const setField = (key: keyof typeof profile) => (v: string) => {
    setProfile(prev => ({ ...prev, [key]: v }))
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Settings
          </h1>
          <p style={{ fontSize: '13px', color: textSecondary }}>
            Manage your account and workspace preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            backgroundColor: saved ? '#22c55e' : '#3b82f6',
            color: '#fff', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.3s',
          }}
        >
          {saved ? <><Check size={13} /> Saved</> : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Profile */}
        <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={16} color={isDark ? '#a3a3a3' : '#6b7280'} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Profile</div>
              <div style={{ fontSize: '12px', color: textMuted }}>Manage your personal details and role</div>
            </div>
          </div>
          <EditableField label="Full name" value={profile.fullName} onChange={setField('fullName')} isDark={isDark} border={border} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} isLast={false} />
          <EditableField label="Role" value={profile.role} onChange={setField('role')} isDark={isDark} border={border} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} isLast={false} />
          <EditableField label="Email" value={profile.email} onChange={setField('email')} isDark={isDark} border={border} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} isLast={false} />
          <EditableField label="Department" value={profile.department} onChange={setField('department')} isDark={isDark} border={border} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} isLast={true} />
        </div>

        {/* Notifications */}
        <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={16} color={isDark ? '#a3a3a3' : '#6b7280'} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Notifications</div>
              <div style={{ fontSize: '12px', color: textMuted }}>Configure how and when you receive alerts</div>
            </div>
          </div>
          {[
            { key: 'blockedAlerts', label: 'Blocked task alerts', desc: 'Get notified when a task is blocked' },
            { key: 'dailySummary', label: 'Daily AI summary email', desc: 'Receive end-of-day operational summaries' },
            { key: 'handoverReminders', label: 'Handover reminders', desc: 'Reminders for pending handovers' },
            { key: 'sprintWarnings', label: 'Sprint deadline warnings', desc: 'Alerts when sprint end is approaching' },
          ].map(({ key, label, desc }, i, arr) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 20px',
              borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: '13.5px', color: textPrimary, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: '12px', color: textMuted, marginTop: '2px' }}>{desc}</div>
              </div>
              <Toggle
                value={toggles[key as keyof typeof toggles]}
                onChange={v => setToggles(prev => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Appearance */}
        <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Palette size={16} color={isDark ? '#a3a3a3' : '#6b7280'} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Appearance</div>
              <div style={{ fontSize: '12px', color: textMuted }}>Theme and display preferences</div>
            </div>
          </div>
          {[
            { label: 'Theme', value: isDark ? 'Dark' : 'Light' },
            { label: 'Language', value: 'English (UK)' },
            { label: 'Timezone', value: 'UTC+1 (WAT)' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 20px',
              borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
            }}>
              <span style={{ fontSize: '13.5px', color: textSecondary }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary }}>{value}</span>
                <ChevronRight size={13} color={textMuted} />
              </div>
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={16} color={isDark ? '#a3a3a3' : '#6b7280'} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>Security</div>
              <div style={{ fontSize: '12px', color: textMuted }}>Password, 2FA, and session settings</div>
            </div>
          </div>
          {[
            { label: 'Password', value: '••••••••••••' },
            { label: 'Two-factor auth', value: 'Enabled' },
            { label: 'Active sessions', value: '2 devices' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 20px',
              borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
            }}>
              <span style={{ fontSize: '13.5px', color: textSecondary }}>{label}</span>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: textPrimary, fontSize: '13.5px', fontWeight: 500, fontFamily: 'inherit',
                padding: '4px 8px', borderRadius: '6px',
              }}>
                {value}
                <ChevronRight size={13} color={textMuted} />
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{
          backgroundColor: isDark ? 'rgba(239,68,68,0.05)' : '#fff5f5',
          border: `1px solid ${isDark ? 'rgba(239,68,68,0.15)' : '#fecaca'}`,
          borderRadius: '12px', padding: '18px 20px',
        }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ef4444', marginBottom: '6px' }}>
            Danger Zone
          </div>
          <div style={{ fontSize: '13px', color: isDark ? '#737373' : '#9ca3af', marginBottom: '14px' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                alert('Account deletion request submitted.')
              }
            }}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #ef4444', background: 'none',
              color: '#ef4444', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
