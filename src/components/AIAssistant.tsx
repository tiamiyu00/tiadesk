import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { streamChat, buildWorkspaceContext, type ChatMessage } from '../lib/ai'
import type { Task, TeamMember, HandoverNote, Alert } from '../data/mockData'

interface AIAssistantProps {
  isDark: boolean
  tasks: Task[]
  members: TeamMember[]
  handovers: HandoverNote[]
  alerts: Alert[]
}

const QUICK_PROMPTS = [
  "What's blocked right now?",
  "Who needs help today?",
  "Summarize today's status",
  "Which tasks are overdue?",
]

export default function AIAssistant({ isDark, tasks, members, handovers, alerts }: AIAssistantProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || streaming) return
    setInput('')

    const userMsg: ChatMessage = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages([...history, { role: 'assistant', content: '' }])
    setStreaming(true)

    const ctx = buildWorkspaceContext(tasks, members, handovers, alerts)
    try {
      await streamChat(history, ctx, (token) => {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + token }
          return next
        })
      })
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Error reaching AI. Check your VITE_ANTHROPIC_API_KEY in .env.' }
        return next
      })
    }
    setStreaming(false)
  }

  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const surface = isDark ? '#111111' : '#ffffff'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const inputBg = isDark ? '#0d0d0d' : '#f9fafb'

  return (
    <>
      <style>{`
        @keyframes aiDot { 0%,60%,100% { opacity:.3; transform:scale(.8) } 30% { opacity:1; transform:scale(1.1) } }
        @keyframes aiSpin { to { transform: rotate(360deg) } }
        @keyframes aiPop { from { opacity:0; transform:translateY(8px) scale(.97) } to { opacity:1; transform:none } }
      `}</style>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px',
          width: '360px', height: '520px',
          backgroundColor: surface, border: `1px solid ${border}`,
          borderRadius: '18px',
          boxShadow: isDark ? '0 28px 70px rgba(0,0,0,0.7)' : '0 28px 70px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1500, overflow: 'hidden',
          animation: 'aiPop 0.18s ease',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: `1px solid ${border}`,
            background: isDark
              ? 'linear-gradient(135deg, #0c0c18 0%, #111111 100%)'
              : 'linear-gradient(135deg, #f3f0ff 0%, #ffffff 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.2px' }}>Workspace AI</div>
                <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 500 }}>● Live · Claude</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, fontSize: '11px', padding: '3px 7px', borderRadius: '5px', fontFamily: 'inherit' }}
                >
                  Clear
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, display: 'flex', padding: '3px' }}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px', margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                }}>
                  <Sparkles size={24} color="#fff" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>How can I help?</div>
                <div style={{ fontSize: '12.5px', color: textSecondary, marginBottom: '18px', lineHeight: '1.5' }}>
                  I have live access to your team, tasks, and alerts.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: `1px solid ${border}`, background: 'none',
                        fontSize: '12.5px', color: textSecondary, textAlign: 'left',
                        fontFamily: 'inherit', transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#818cf8' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textSecondary }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: '8px', alignItems: 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0, marginTop: '2px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Sparkles size={11} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '9px 12px', borderRadius: '12px',
                  borderTopRightRadius: msg.role === 'user' ? '3px' : '12px',
                  borderTopLeftRadius: msg.role === 'assistant' ? '3px' : '12px',
                  backgroundColor: msg.role === 'user' ? '#6366f1' : (isDark ? '#1a1a1a' : '#f3f4f6'),
                  fontSize: '13px', color: msg.role === 'user' ? '#fff' : textPrimary,
                  lineHeight: '1.6', whiteSpace: 'pre-wrap',
                }}>
                  {msg.content !== '' ? msg.content : (
                    streaming && i === messages.length - 1 ? (
                      <span style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
                        {[0, 0.2, 0.4].map((delay, j) => (
                          <span key={j} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: textSecondary, animation: `aiDot 1.2s infinite ${delay}s` }} />
                        ))}
                      </span>
                    ) : ''
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: `1px solid ${border}` }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask anything about your workspace…"
                disabled={streaming}
                style={{
                  flex: 1, padding: '8px 12px',
                  backgroundColor: inputBg, border: `1px solid ${border}`,
                  borderRadius: '9px', fontSize: '13px', color: textPrimary,
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                style={{
                  width: '36px', height: '36px', borderRadius: '9px', border: 'none',
                  backgroundColor: input.trim() && !streaming ? '#6366f1' : (isDark ? '#1a1a1a' : '#f3f4f6'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !streaming ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {streaming
                  ? <div style={{ width: '14px', height: '14px', border: `2px solid ${textSecondary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'aiSpin 0.8s linear infinite' }} />
                  : <Send size={14} color={input.trim() ? '#fff' : textSecondary} />
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Workspace AI"
        style={{
          position: 'fixed', bottom: '52px', right: '24px',
          width: '54px', height: '54px', borderRadius: '50%', border: 'none',
          background: open ? (isDark ? '#1f1f1f' : '#f3f4f6') : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? 'none' : '0 8px 28px rgba(99,102,241,0.55)',
          zIndex: 1500, transition: 'all 0.2s',
        }}
      >
        {open
          ? <X size={20} color={isDark ? '#fafafa' : '#111827'} />
          : <Sparkles size={22} color="#fff" />
        }
      </button>
    </>
  )
}
