export default function ChartPanel({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`chart-panel ${className}`}>
      <div className="chart-panel__header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="chart-panel__body">{children}</div>
    </section>
  );
}
