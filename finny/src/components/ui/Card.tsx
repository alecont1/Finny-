import type { HTMLAttributes, ReactNode } from 'react';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  gradient?: boolean;
  highlight?: boolean;
  hoverable?: boolean;
  children: ReactNode;
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  padding = 'md',
  gradient = false,
  highlight = false,
  hoverable = false,
  onClick,
  className = '',
  children,
  ...props
}: CardProps) {
  const isClickable = !!onClick || hoverable;

  return (
    <div
      className={`
        rounded-2xl border border-white/10
        ${gradient
          ? 'bg-gradient-to-br from-surface to-surface/50'
          : 'bg-surface'
        }
        ${highlight ? 'border-primary/30 shadow-lg shadow-primary/10' : ''}
        ${isClickable ? 'cursor-pointer hover:bg-surface-hover transition-colors duration-200' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
