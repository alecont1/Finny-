import { CATEGORIES } from '../../utils/constants';
import type { Category } from '../../types';

interface CategoryPickerProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-3">
        Categoria
      </label>
      <div className="grid grid-cols-3 gap-2">
        {Object.values(CATEGORIES).map((category) => {
          const isSelected = selected === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`
                p-3 rounded-xl text-center transition-all duration-200
                ${isSelected
                  ? 'bg-primary/20 border-2 border-primary scale-105'
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }
              `}
            >
              <span className="text-2xl block mb-1">{category.icon}</span>
              <span className={`text-xs ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
