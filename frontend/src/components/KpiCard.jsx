export default function KpiCard({ label, value, detail, icon: Icon, accent }) {
  return (
    <article className={`kpi-card kpi-card--${accent}`}>
      <div className="kpi-card__topline">
        <span className="kpi-card__label">{label}</span>
        <span className="kpi-card__icon" aria-hidden="true"><Icon size={19} strokeWidth={1.8} /></span>
      </div>
      <strong className="kpi-card__value">{value}</strong>
      <span className="kpi-card__detail">{detail}</span>
    </article>
  );
}
