import { UserRole } from '@/lib/types'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const styles = {
    student: 'bg-cpss-green/20 text-cpss-green border border-cpss-green/30',
    alumni: 'bg-cpss-gold/20 text-cpss-gold border border-cpss-gold/30',
    teacher: 'bg-cpss-green/20 text-cpss-green border border-cpss-green/30',
  }

  const labels = {
    student: 'Student',
    alumni: 'Alumni',
    teacher: 'Teacher',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[role]} ${className}`}>
      {labels[role]}
    </span>
  )
}

