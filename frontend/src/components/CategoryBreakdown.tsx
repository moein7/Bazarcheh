import { CATEGORIES, type Category } from '../types';
import { formatCategory } from '../format';

interface Props {
  counts: Record<Category, number>;
  total: number;
  selectedCategory?: Category | 'all';
  onSelectCategory?: (category: Category) => void;
}

export default function CategoryBreakdown({ counts, total, selectedCategory = 'all', onSelectCategory }: Props) {
  return (
    <section className="card">
      <h2>دسته‌بندی درخواست‌ها</h2>
      <ul className="breakdown">
        {CATEGORIES.map((cat) => {
          const pct = (total > 0 ? (counts[cat] / total) * 100 : 0).toFixed(1);
          return (
            <li key={cat} className={selectedCategory === cat ? 'category-selected' : ''}>
              <button type="button" className="category-filter-button" aria-pressed={selectedCategory === cat} onClick={() => onSelectCategory?.(cat)} title={`فیلتر پیام‌های ${formatCategory(cat)}`}>
              <span className="cat-name">{formatCategory(cat)}</span>
              <span className="bar">
                <span className="bar-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="cat-count">{counts[cat].toLocaleString()}</span>
              <span className="cat-pct">{pct}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
