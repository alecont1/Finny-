import { MONTHS } from '../../utils/constants';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  monthStatus?: Record<number, 'good' | 'warning' | 'danger'>;
}

export function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  monthStatus = {},
}: MonthSelectorProps) {
  const currentMonth = new Date().getMonth() + 1;

  const getStatusColor = (month: number) => {
    const status = monthStatus[month];
    switch (status) {
      case 'good':
        return 'bg-primary/20 border-primary';
      case 'warning':
        return 'bg-warning/20 border-warning';
      case 'danger':
        return 'bg-danger/20 border-danger';
      default:
        return 'bg-white/5 border-transparent';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-muted">
          {selectedYear}
        </h3>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {MONTHS.slice(1).map((monthName, index) => {
          const month = index + 1;
          const isSelected = month === selectedMonth;
          const isFuture = month > currentMonth && selectedYear >= new Date().getFullYear();
          const statusColor = getStatusColor(month);

          return (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              disabled={isFuture}
              className={`
                flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 border-2
                ${isSelected
                  ? 'bg-primary text-white border-primary scale-105 shadow-lg shadow-primary/30'
                  : isFuture
                    ? 'bg-white/5 text-text-muted/50 border-transparent cursor-not-allowed'
                    : `${statusColor} text-white hover:bg-white/10`
                }
              `}
            >
              {monthName.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
