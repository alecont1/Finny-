import { usePremium } from '../../hooks/usePremium'

interface PremiumBadgeProps {
  showFree?: boolean
  size?: 'sm' | 'md'
}

export function PremiumBadge({ showFree = false, size = 'sm' }: PremiumBadgeProps) {
  const { isPremium } = usePremium()

  if (!isPremium && !showFree) return null

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  if (isPremium) {
    return (
      <span className={`bg-primary/20 text-primary font-semibold rounded-full ${sizeClasses}`}>
        Premium
      </span>
    )
  }

  return (
    <span className={`bg-white/10 text-text-muted font-medium rounded-full ${sizeClasses}`}>
      Free
    </span>
  )
}
