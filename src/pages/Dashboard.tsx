import { TrendingUp, Users, AlertTriangle, ArrowLeftRight } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import { teamMembers } from '../data/mockData'
import type { PageType } from '../App'

interface DashboardProps {
  isDark: boolean
  onNavigate: (page: PageType) => void
}

function OpsHealthRing({ score, isDark }: { score: number; isDark: boolean }) {
  const radius = 48
  const stroke = 6
  const norm = 2 * Math.PI * radius
  const filled = (score / 100) * norm

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke={isDark ? '#1f1f1f' : '#f3f4f6'} strokeWidth={stroke} />
      <circle
        cx="60" cy="60" r={radius} fill="none"
        stroke="#3b82f6" strokeWidth={stroke}
        strokeDasharray={`${filled} ${norm}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="55" textAnchor="middle" fill={isDark ? '#fafafa' : '#111827'} fontSize="22" fontWeight="700">
        {score}
      </text>
      <text x="60" y="70" textAnchor="middle" fill={isDark ? '#525252' : '#9ca3af'} fontSize="10">
        / 100
      </text>
    </svg>
  )
}

function ProgressBar({ label, value, color, isDark }: { label: string; value: number; color: string; isDark: boolean }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: isDark ? '#a3a3a3' : '#6b7280' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#fafafa' : '#111827' }}>{value}%</span>
      </div>
      <div style={{
        height: '4px',
        borderRadius: '2px',
        backgroundColor: isDark ? '#1f1f1f' : '#f3f4f6',
        overflow: 'hidden',
      }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: '2px', backgroundColor: color, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function Dashboard({ isDark, onNavigate }: DashboardProps) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'
  const textMuted = isDark ? '#525252' : '#9ca3af'

  const statCards: Array<{
    icon: typeof TrendingUp; label: string; value: string;
    valueColor: string; sub: string; subColor: string;
    accentBar: string; nav: PageType;
  }> = [
    {
      icon: TrendingUp, label: 'Pulse score', value: '87',
      valueColor: '#3b82f6', sub: '↑ +4 from yesterday', subColor: '#22c55e',
      accentBar: '#3b82f6', nav: 'reports',
    },
    {
      icon: Users, label: 'Active capacity', value: '94%',
      valueColor: '#22c55e', sub: '17 of 18 online', subColor: isDark ? '#737373' : '#6b7280',
      accentBar: '#22c55e', nav: 'team-status',
    },
    {
      icon: AlertTriangle, label: 'Blocked tasks', value: '3',
      valueColor: '#f59e0b', sub: 'Needs attention', subColor: '#f59e0b',
      accentBar: '#f59e0b', nav: 'tasks',
    },
    {
      icon: ArrowLeftRight, label: 'Handovers today', value: '12',
      valueColor: isDark ? '#fafafa' : '#111827', sub: 'All documented',
      subColor: isDark ? '#737373' : '#6b7280', accentBar: '#6366f1', nav: 'handovers',
    },
  ]

  const liveMembers = teamMembers.slice(0, 5)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: textPrimary,
            marginBottom: '4px',
            letterSpacing: '-0.3px',
          }}>
            Good morning, Amara
          </h1>
          <p style={{ fontSize: '13.5px', color: textSecondary }}>
            Your team is 94% operational — looking strong today.
          </p>
        </div>
        <div style={{
          padding: '6px 14px',
          borderRadius: '8px',
          border: `1px solid ${border}`,
          fontSize: '12.5px',
          color: textSecondary,
          backgroundColor: surface,
        }}>
          Saturday, 9 May 2026
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              onClick={() => onNavigate(card.nav)}
              style={{
                backgroundColor: surface,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, transform 0.1s',
                padding: '18px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                left: 0, top: '15%', height: '70%', width: '3px',
                borderRadius: '0 2px 2px 0',
                backgroundColor: card.accentBar,
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
              }}>
                <Icon size={13} color={isDark ? '#525252' : '#9ca3af'} strokeWidth={1.8} />
                <span style={{ fontSize: '12px', color: textMuted, fontWeight: 500 }}>
                  {card.label}
                </span>
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 800,
                color: card.valueColor,
                lineHeight: 1,
                marginBottom: '6px',
                letterSpacing: '-1px',
              }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: card.subColor, fontWeight: 500 }}>
                {card.sub}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '12px' }}>
        {/* Team live status */}
        <div style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>
              Team — live status
            </span>
            <span style={{
              fontSize: '11.5px',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: '#22c55e',
                animation: 'pulse 2s infinite',
              }} />
              Live · updated now
            </span>
          </div>
          <div>
            {liveMembers.map((member, i) => (
              <div
                key={member.id}
                onClick={() => onNavigate('team-status')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '13px 20px',
                  borderBottom: i < liveMembers.length - 1 ? `1px solid ${border}` : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#161616' : '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Avatar initials={member.initials} color={member.color} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: textPrimary }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: textMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {member.task}
                  </div>
                </div>
                <StatusBadge status={member.status} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>

        {/* Ops Health */}
        <div style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>
            Ops health
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <OpsHealthRing score={87} isDark={isDark} />
            <span style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#22c55e',
              backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : '#dcfce7',
              padding: '3px 10px',
              borderRadius: '12px',
            }}>
              On track
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ProgressBar label="Productivity" value={91} color="#22c55e" isDark={isDark} />
            <ProgressBar label="Response time" value={78} color="#3b82f6" isDark={isDark} />
            <ProgressBar label="No delays" value={62} color="#f59e0b" isDark={isDark} />
          </div>

          <div style={{
            fontSize: '11.5px',
            color: textMuted,
            textAlign: 'center',
            padding: '8px 0 0',
            borderTop: `1px solid ${border}`,
          }}>
            Sprint ends in 3 days
          </div>
        </div>
      </div>
    </div>
  )
}
