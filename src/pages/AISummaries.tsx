import { useState } from 'react'
import { CheckCircle, AlertCircle, Clock, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { dailySummaries } from '../data/mockData'
import { buildWorkspaceContext, streamSummary } from '../lib/ai'
import type { Task, TeamMember, HandoverNote, Alert } from '../data/mockData'

interface AISummariesProps {
  isDark: boolean
  tasks: Task[]
  members: TeamMember[]
  handovers: HandoverNote[]
  alerts: Alert[]
}

export default function AISummaries({ isDark, tasks, members, handovers, alerts }: AISummariesProps) {
  const [idx, setIdx] = useState(0)
  const [liveText, setLiveText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [tab, setTab] = useState<'live' | 'history'>('live')
  const summary = dailySummaries[idx]

  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const generate = async () => {
    setGenerating(true)
    setLiveText('')
    const ctx = buildWorkspaceContext(tasks, members, handovers, alerts)
    try {
      await streamSummary(ctx, (token) => setLiveText(prev => prev + token))
    } catch {
      setLiveText('⚠️ Error connecting to AI. Make sure VITE_ANTHROPIC_API_KEY is set in your .env file.')
    }
    setGenerating(false)
  }

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <div key={i} style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, marginTop: i > 0 ? '20px' : '0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '3px', height: '14px', borderRadius: '2px', backgroundColor: '#6366f1', flexShrink: 0 }} />
            {line.slice(3)}
          </div>
        )
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.match(/^\d+\./)) {
        return (
          <div key={i} style={{ fontSize: '13.5px', color: textSecondary, lineHeight: '1.6', display: 'flex', gap: '8px', paddingLeft: '4px', marginBottom: '4px' }}>
            <span style={{ color: '#6366f1', flexShrink: 0 }}>{line.match(/^\d+\./) ? line.match(/^\d+\./)?.[0] : '•'}</span>
            <span>{line.replace(/^[•\-]\s/, '').replace(/^\d+\.\s/, '')}</span>
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} style={{ height: '4px' }} />
      return <div key={i} style={{ fontSize: '13.5px', color: textSecondary, lineHeight: '1.6', marginBottom: '4px' }}>{line}</div>
    })
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
            AI Summaries
          </h1>
          <p style={{ fontSize: '13px', color: textSecondary }}>
            Live AI analysis and end-of-day operational reports
          </p>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6', borderRadius: '10px' }}>
          {(['live', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '5px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                fontSize: '12.5px', fontWeight: tab === t ? 600 : 400,
                backgroundColor: tab === t ? (isDark ? '#262626' : '#fff') : 'transparent',
                color: tab === t ? textPrimary : textSecondary,
                boxShadow: tab === t ? `0 1px 4px ${isDark ? '#00000060' : '#0000001a'}` : 'none',
                fontFamily: 'inherit', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              {t === 'live' ? <><Zap size={12} />{' '}Live AI</> : <><Clock size={12} />{' '}History</>}
            </button>
          ))}
        </div>
      </div>

      {tab === 'live' && (
        <>
          {/* AI badge + generate button */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px', padding: '12px 16px', borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : '#f0f4ff',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#c7d2fe'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="#6366f1" />
              <span style={{ fontSize: '12.5px', color: isDark ? '#818cf8' : '#4f46e5', fontWeight: 500 }}>
                Claude AI · Powered by live workspace data
              </span>
            </div>
            <button
              onClick={generate}
              disabled={generating}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '8px', border: 'none',
                background: generating ? (isDark ? '#1f1f1f' : '#f3f4f6') : 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: generating ? textMuted : '#fff',
                fontSize: '13px', fontWeight: 500, cursor: generating ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              {generating ? (
                <>
                  <div style={{ width: '12px', height: '12px', border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating…
                </>
              ) : (
                <><Sparkles size={13} /> Generate Today's Summary</>
              )}
            </button>
          </div>

          {liveText ? (
            <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '24px' }}>
              {renderMarkdown(liveText)}
              {generating && (
                <span style={{
                  display: 'inline-block', width: '8px', height: '16px',
                  backgroundColor: '#6366f1', borderRadius: '2px',
                  animation: 'blink 0.8s step-end infinite',
                }} />
              )}
            </div>
          ) : !generating && (
            <div style={{
              backgroundColor: surface, border: `1px dashed ${border}`, borderRadius: '14px',
              padding: '48px', textAlign: 'center',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 14px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={26} color="#fff" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '6px' }}>
                Generate a live AI summary
              </div>
              <div style={{ fontSize: '13px', color: textSecondary, maxWidth: '360px', margin: '0 auto', lineHeight: '1.6' }}>
                Claude will analyse your current tasks, team status, handovers, and alerts to produce a sharp operational summary.
              </div>
            </div>
          )}
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
          `}</style>
        </>
      )}

      {tab === 'history' && (
        <>
          {/* Date navigator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button
              onClick={() => setIdx(Math.min(dailySummaries.length - 1, idx + 1))}
              disabled={idx >= dailySummaries.length - 1}
              style={{ padding: '6px', border: `1px solid ${border}`, borderRadius: '7px', background: 'none', cursor: 'pointer', color: idx >= dailySummaries.length - 1 ? textMuted : textSecondary, display: 'flex' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 500 }}>{formatDate(summary.date)}</span>
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
              style={{ padding: '6px', border: `1px solid ${border}`, borderRadius: '7px', background: 'none', cursor: 'pointer', color: idx === 0 ? textMuted : textSecondary, display: 'flex' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 16px', borderRadius: '10px', backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : '#f0f4ff', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#c7d2fe'}` }}>
            <Sparkles size={14} color="#6366f1" />
            <span style={{ fontSize: '12.5px', color: isDark ? '#818cf8' : '#4f46e5', fontWeight: 500 }}>
              Generated by Workspace AI · {new Date(summary.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Tasks Completed', value: summary.completedTasks, color: '#22c55e', icon: CheckCircle },
              { label: 'Tasks Blocked',   value: summary.blockedTasks,   color: '#ef4444', icon: AlertCircle },
              { label: 'Tasks Pending',   value: summary.pendingTasks,   color: '#f59e0b', icon: Clock       },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
                  <div style={{ fontSize: '12px', color: textMuted, marginTop: '3px' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {[
            { title: 'Highlights', icon: CheckCircle, color: '#22c55e', items: summary.highlights, bullet: '✓' },
            ...(summary.blockers.length > 0 ? [{ title: 'Blockers', icon: AlertCircle, color: '#ef4444', items: summary.blockers, bullet: '!' }] : []),
            { title: "Tomorrow's Priorities", icon: Clock, color: '#3b82f6', items: summary.nextDayPriorities, bullet: null },
          ].map(({ title, icon: Icon, color, items, bullet }) => (
            <div key={title} style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={15} color={color} /> {title}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13.5px', color: textSecondary, lineHeight: '1.5' }}>
                    <span style={{ color, marginTop: '2px', flexShrink: 0, minWidth: '16px', fontWeight: 700 }}>
                      {bullet ?? `${i + 1}.`}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
