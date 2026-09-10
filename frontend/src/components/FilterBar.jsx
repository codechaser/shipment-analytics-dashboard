import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, categories, statuses, onChange, onReset }) {
  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      <div className="filter-bar__heading">
        <span className="section-kicker"><Filter size={14} /> Refine view</span>
        <button className="text-button" type="button" onClick={onReset} title="Clear all filters">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div className="filter-grid">
        <label className="field">
          <span>Date from</span>
          <div className="field__input">
            <CalendarDays size={15} />
            <input type="date" value={filters.dateFrom} onChange={(event) => onChange('dateFrom', event.target.value)} />
          </div>
        </label>
        <label className="field">
          <span>Date to</span>
          <div className="field__input">
            <CalendarDays size={15} />
            <input type="date" value={filters.dateTo} onChange={(event) => onChange('dateTo', event.target.value)} />
          </div>
        </label>
        <label className="field">
          <span>Category</span>
          <select value={filters.category} onChange={(event) => onChange('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Delivery status</span>
          <select value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}
