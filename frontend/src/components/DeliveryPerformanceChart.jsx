import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const statusColors = { Delivered: '#0e7c7b', Delayed: '#e0704d', Unknown: '#9c9a8f' };

export default function DeliveryPerformanceChart({ data }) {
  if (!data.length) {
    return <div className="chart-empty">No delivery records match these filters.</div>;
  }

  const totalOrders = data.reduce((total, entry) => total + entry.orders, 0);

  return (
    <div className="delivery-chart">
      <div className="delivery-chart__plot">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="orders" nameKey="status" cx="50%" cy="48%" innerRadius="56%" outerRadius="78%" paddingAngle={3} stroke="#fffdf8" strokeWidth={4}>
              {data.map((entry) => <Cell key={entry.status} fill={statusColors[entry.status] || statusColors.Unknown} />)}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Orders']} contentStyle={{ border: '1px solid #dedbd0', borderRadius: 8, background: '#fffdf8', fontSize: 12 }} />
            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#242b2a" fontSize="25" fontWeight="600">{totalOrders}</text>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="#73746e" fontSize="11">orders</text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="delivery-chart__legend">
        {data.map((entry) => (
          <div className="delivery-legend-item" key={entry.status}>
            <span style={{ backgroundColor: statusColors[entry.status] || statusColors.Unknown }} />
            <span>{entry.status}</span>
            <strong>{entry.orders}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
