import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isDark: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export default function Modal({ isDark, title, onClose, children, width = '520px' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width, maxWidth: '95vw', maxHeight: '90vh',
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 22px',
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: textPrimary }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: textMuted, padding: '2px', display: 'flex', borderRadius: '5px',
          }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  )
}
