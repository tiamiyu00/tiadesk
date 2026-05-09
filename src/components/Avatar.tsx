interface AvatarProps {
  initials: string
  color: string
  size?: number
}

export default function Avatar({ initials, color, size = 32 }: AvatarProps) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color + '22',
      border: `1.5px solid ${color}55`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.34,
      fontWeight: 600,
      color: color,
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  )
}
