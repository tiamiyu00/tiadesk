import { useState } from 'react'
import { Plus, ChevronRight, Check } from 'lucide-react'
import Avatar from '../components/Avatar'
import HandoverModal from '../components/HandoverModal'
import { type HandoverNote } from '../data/mockData'

interface HandoversProps {
  isDark: boolean
  handoverList: HandoverNote[]
  onAddHandover: (h: HandoverNote) => void
  onUpdateHandover: (h: HandoverNote) => void
}

const statusStyle = {
  Pending: { text: '#d97706', bg: '#fef3c7', darkBg: 'rgba(234,179,8,0.12)' },
  Acknowledged: { text: '#2563eb', bg: '#dbeafe', darkBg: 'rgba(59,130,246,0.12)' },
  Complete: { text: '#16a34a', bg: '#dcfce7', darkBg: 'rgba(34,197,94,0.12)' },
}

export default function Handovers({ isDark, handoverList, onAddHandover, onUpdateHandover }: HandoversProps) {
  const [showModal, setShowModal] = useState(false)

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  const surface2 = isDark ? '#161616' : '#f9fafb'

  const acknowledge = (h: HandoverNote) => {
    if (h.status === 'Pending') onUpdateHandover({ ...h, status: 'Acknowledged' })
  }

  const complete = (h: HandoverNote) => {
    onUpdateHandover({ ...h, status: 'Complete' })
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Handovers
          </h1>
          <p style={{ fontSize: '13px', color: textSecondary }}>
            {handoverList.length} handovers · {handoverList.filter(h => h.status === 'Pending').length} pending acknowledgement
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px', border: 'none',
            backgroundColor: '#3b82f6', color: '#fff', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} />
          New Handover
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {handoverList.map(h => {
          const sc = statusStyle[h.status]
          return (
            <div
              key={h.id}
              style={{
                backgroundColor: surface, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '20px',
                borderLeft: h.status === 'Pending' ? '3px solid #f59e0b' : h.status === 'Acknowledged' ? '3px solid #3b82f6' : '3px solid #22c55e',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar initials={h.fromInitials} color={h.fromColor} size={28} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>{h.from}</span>
                  </div>
                  <ChevronRight size={13} color={textMuted} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar initials={h.toInitials} color={h.toColor} size={28} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>{h.to}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11.5px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
                    backgroundColor: isDark ? sc.darkBg : sc.bg, color: sc.text,
                  }}>
                    {h.status}
                  </span>
                  <span style={{ fontSize: '11.5px', color: textMuted }}>
                    {new Date(h.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Task title */}
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: textPrimary, marginBottom: '10px' }}>
                {h.task}
              </div>

              {/* Notes */}
              <div style={{
                backgroundColor: surface2, borderRadius: '8px', padding: '12px 14px',
                fontSize: '13px', color: textSecondary, lineHeight: '1.6', marginBottom: '14px',
              }}>
                {h.notes}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {h.status === 'Pending' && (
                  <button
                    onClick={() => acknowledge(h)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 14px', borderRadius: '7px',
                      border: '1px solid #3b82f680', backgroundColor: 'rgba(59,130,246,0.08)',
                      color: '#3b82f6', fontSize: '12.5px', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <Check size={13} />
                    Acknowledge
                  </button>
                )}
                {h.status !== 'Complete' && (
                  <button
                    onClick={() => complete(h)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 14px', borderRadius: '7px',
                      border: '1px solid #22c55e80', backgroundColor: 'rgba(34,197,94,0.08)',
                      color: '#22c55e', fontSize: '12.5px', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <Check size={13} />
                    Mark Complete
                  </button>
                )}
                {h.status === 'Complete' && (
                  <span style={{ fontSize: '12.5px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Check size={13} /> Completed
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <HandoverModal
          isDark={isDark}
          onClose={() => setShowModal(false)}
          onSubmit={(h) => { onAddHandover(h); setShowModal(false) }}
        />
      )}
    </div>
  )
}
