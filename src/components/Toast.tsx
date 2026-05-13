import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

const cfg = {
  success: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   Icon: CheckCircle  },
  error:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   Icon: AlertCircle  },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  Icon: AlertTriangle },
  info:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  Icon: Info         },
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const { color, bg, Icon } = cfg[toast.type]

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4500)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '12px 14px',
      backgroundColor: '#111111',
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
      minWidth: '280px', maxWidth: '340px',
      animation: 'toastSlide 0.22s ease',
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#fafafa', marginBottom: toast.message ? '2px' : 0 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: '12px', color: '#737373', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#525252', padding: '1px', flexShrink: 0, display: 'flex' }}
      >
        <X size={13} />
      </button>
    </div>
  )
}

interface ToastsProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export default function Toasts({ toasts, onDismiss }: ToastsProps) {
  if (toasts.length === 0) return null
  return (
    <>
      <style>{`@keyframes toastSlide { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
      <div style={{
        position: 'fixed', bottom: '120px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 2000, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <Toast toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  )
}
