interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

const heightStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max,
  color = '#10b981',
  height = 'md',
  showPercentage = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOverBudget = value > max;

  const barColor = isOverBudget ? '#ef4444' : color;

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${heightStyles[height]}`}>
        <div
          className={`${heightStyles[height]} rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-1 text-xs text-text-muted">
          <span>{Math.round(percentage)}%</span>
          {isOverBudget && (
            <span className="text-danger">Excedido!</span>
          )}
        </div>
      )}
    </div>
  );
}

// Variante circular
interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = '#10b981',
  children,
}: CircularProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
