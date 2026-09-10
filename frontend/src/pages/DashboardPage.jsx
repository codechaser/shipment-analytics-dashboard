import { AlertCircle, Database, PackageCheck, RefreshCw, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import CategoryRevenueChart from '../components/CategoryRevenueChart.jsx';
import ChartPanel from '../components/ChartPanel.jsx';
import DeliveryPerformanceChart from '../components/DeliveryPerformanceChart.jsx';
import FilterBar from '../components/FilterBar.jsx';
import KpiCard from '../components/KpiCard.jsx';
import RecordsTable from '../components/RecordsTable.jsx';
import RevenueTrendChart from '../components/RevenueTrendChart.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';

const initialFilters = { dateFrom: '', dateTo: '', category: '', status: '' };
const numberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

export default function DashboardPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [trendMode, setTrendMode] = useState('revenue');
  const { data, error, loading, refresh } = useAnalytics(filters);

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const categories = data?.categoryRevenue?.map((entry) => entry.category) || [];
  const statuses = data?.deliveryPerformance?.map((entry) => entry.status) || [];

  if (error && !data) {
    return (
      <main className="app-shell app-shell--centered">
        <div className="error-state">
          <span className="error-state__icon"><AlertCircle size={24} /></span>
          <span className="section-kicker">Connection interrupted</span>
          <h1>Analytics data is unavailable</h1>
          <p>{error}</p>
          <button className="primary-button" type="button" onClick={refresh}><RefreshCw size={16} /> Try again</button>
        </div>
      </main>
    );
  }

  if (loading && !data) {
    return (
      <main className="app-shell app-shell--centered">
        <div className="loading-state">
          <span className="loading-state__mark"><Database size={22} /></span>
          <span className="section-kicker">Preparing your view</span>
          <h1>Loading shipment intelligence</h1>
          <div className="loading-bar"><span /></div>
        </div>
      </main>
    );
  }

  const sourceCurrency = data?.metadata?.sourceCurrency || 'UNSPECIFIED';
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark"><PackageCheck size={22} /></span>
          <div>
            <span className="brand-name">Parcel / Signal</span>
            <span className="brand-subtitle">Shipment analytics workspace</span>
          </div>
        </div>
        <div className="topbar__meta">
          <span className="live-indicator"><span /> Live dataset</span>
          <button className="icon-button" type="button" onClick={refresh} title="Refresh analytics data" aria-label="Refresh analytics data"><RefreshCw size={17} /></button>
        </div>
      </header>

      <section className="hero-row">
        <div>
          <span className="section-kicker">Operations overview <span className="kicker-dot" /></span>
          <h1>Where every order<br /><em>lands next.</em></h1>
          <p className="hero-copy">A clear read on order value, category mix, and delivery momentum across your shipment data.</p>
        </div>
        <div className="hero-stamp">
          <span>Source currency</span>
          <strong>{sourceCurrency}</strong>
          <small>Conversion: Not configured</small>
        </div>
      </section>

      <FilterBar filters={filters} categories={categories} statuses={statuses} onChange={updateFilter} onReset={() => setFilters(initialFilters)} />

      {error && <div className="inline-error"><AlertCircle size={16} /> {error}</div>}

      <section className={`kpi-grid ${loading ? 'is-refreshing' : ''}`} aria-label="Key performance indicators">
        <KpiCard label="Total orders" value={formatNumber(data?.kpis.totalOrders)} detail={hasActiveFilters ? 'Matching current filters' : 'Across the loaded dataset'} icon={ShoppingCart} accent="teal" />
        <KpiCard label="Total revenue" value={formatNumber(data?.kpis.totalRevenue)} detail={`Source revenue · ${sourceCurrency}`} icon={TrendingUp} accent="coral" />
        <KpiCard label="Delayed orders" value={formatNumber(data?.kpis.delayedOrders)} detail="Flagged by shipment status" icon={TrendingDown} accent="gold" />
      </section>

      <section className="chart-grid">
        <ChartPanel
          title="Revenue trend"
          subtitle="Daily movement across the selected view"
          className="chart-panel--wide"
          action={(
            <div className="segmented-control" aria-label="Revenue trend measure">
              <button className={trendMode === 'revenue' ? 'is-active' : ''} type="button" onClick={() => setTrendMode('revenue')}>Revenue</button>
              <button className={trendMode === 'orders' ? 'is-active' : ''} type="button" onClick={() => setTrendMode('orders')}>Orders</button>
            </div>
          )}
        >
          <RevenueTrendChart data={data?.revenueTrend || []} mode={trendMode} />
        </ChartPanel>
        <ChartPanel title="Category mix" subtitle="Select a bar to filter the dashboard">
          <CategoryRevenueChart data={data?.categoryRevenue || []} onCategorySelect={(category) => updateFilter('category', category)} />
        </ChartPanel>
        <ChartPanel title="Delivery performance" subtitle="Order count by current shipment status">
          <DeliveryPerformanceChart data={data?.deliveryPerformance || []} />
        </ChartPanel>
      </section>

      {(data?.records?.items || []).length > 0 ? <RecordsTable records={data.records.items} /> : (
        <section className="records-panel records-panel--empty">
          <span className="section-kicker">Joined records</span>
          <h2>No records in this view</h2>
          <p>Try widening the date range or clearing a filter to bring the shipment data back.</p>
          <button className="primary-button" type="button" onClick={() => setFilters(initialFilters)}>Clear filters</button>
        </section>
      )}

      <footer className="footer-note">
        <span>Showing {data?.records?.items?.length || 0} of {data?.records?.pagination?.total || 0} joined item records</span>
        <span>Updated {data?.metadata?.generatedAt ? new Date(data.metadata.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}</span>
      </footer>
    </main>
  );
}
