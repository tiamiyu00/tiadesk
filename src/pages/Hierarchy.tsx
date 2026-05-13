import Avatar from '../components/Avatar'
import { type TeamMember } from '../data/mockData'

interface HierarchyProps { isDark: boolean; members: TeamMember[] }

const orgTree = {
  id: 'dm', name: 'Daniel M.', role: 'Product Director', color: '#14b8a6', initials: 'DM',
  children: [
    {
      id: 'am', name: 'Amara D.', role: 'Lead Engineer', color: '#6366f1', initials: 'AD',
      children: [
        { id: 'jo', name: 'James O.', role: 'Backend Engineer', color: '#eab308', initials: 'JO', children: [] },
        { id: 'rb', name: 'Remi B.', role: 'DevOps Engineer', color: '#a855f7', initials: 'RB', children: [] },
      ],
    },
    {
      id: 'km', name: 'Kofi M.', role: 'Senior Designer', color: '#0ea5e9', initials: 'KM',
      children: [],
    },
    {
      id: 'fs', name: 'Fatima S.', role: 'Product Manager', color: '#f43f5e', initials: 'FS',
      children: [],
    },
    {
      id: 'nl', name: 'Nadia L.', role: 'Ops Lead', color: '#22c55e', initials: 'NL',
      children: [
        { id: 'cc', name: 'Clara C.', role: 'CS Manager', color: '#f97316', initials: 'CC', children: [] },
      ],
    },
  ],
}

interface OrgNode {
  id: string; name: string; role: string; color: string; initials: string;
  children: OrgNode[]
}

function NodeCard({ node, isDark, depth = 0 }: { node: OrgNode; isDark: boolean; depth?: number }) {
  const surface = isDark ? '#111111' : '#ffffff'
  const border = isDark ? '#1f1f1f' : '#e5e7eb'
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textMuted = isDark ? '#525252' : '#9ca3af'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        backgroundColor: surface, border: `1px solid ${border}`,
        borderRadius: '12px', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: '10px',
        minWidth: '160px', cursor: 'pointer',
        boxShadow: depth === 0 ? `0 2px 8px ${isDark ? '#00000060' : '#0000001a'}` : 'none',
        position: 'relative',
      }}>
        {depth === 0 && (
          <div style={{
            position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
            width: '40px', height: '3px', borderRadius: '0 0 4px 4px',
            backgroundColor: node.color,
          }} />
        )}
        <Avatar initials={node.initials} color={node.color} size={36} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{node.name}</div>
          <div style={{ fontSize: '11.5px', color: textMuted }}>{node.role}</div>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: '#22c55e', marginTop: '4px',
          }} />
        </div>
      </div>

      {node.children.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '1px', height: '24px', backgroundColor: isDark ? '#262626' : '#e5e7eb' }} />
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%',
              height: '1px', backgroundColor: isDark ? '#262626' : '#e5e7eb',
            }} />
            {node.children.map(child => (
              <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? '#262626' : '#e5e7eb' }} />
                <NodeCard node={child} isDark={isDark} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Hierarchy({ isDark, members: _members }: HierarchyProps) {
  const textPrimary = isDark ? '#fafafa' : '#111827'
  const textSecondary = isDark ? '#a3a3a3' : '#6b7280'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Hierarchy
        </h1>
        <p style={{ fontSize: '13px', color: textSecondary }}>
          Reporting structure and team organisation
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', paddingBottom: '20px' }}>
        <NodeCard node={orgTree} isDark={isDark} />
      </div>
    </div>
  )
}
