import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const numberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export default function RevenueTrendChart({ data, mode }) {
  if (!data.length) {
    return <div className="chart-empty">No trend data matches these filters.</div>;
  }

  const isRevenue = mode === 'revenue';
  const dataKey = isRevenue ? 'sourceRevenue' : 'orders';
  const color = isRevenue ? '#0e7c7b' : '#e0704d';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#d9d6ca" strokeDasharray="3 5" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#73746e', fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#73746e', fontSize: 11 }} tickFormatter={(value) => isRevenue ? numberFormatter.format(value) : value} />
        <Tooltip
          cursor={{ stroke: '#b8b6aa', strokeDasharray: '4 4' }}
          formatter={(value) => [isRevenue ? numberFormatter.format(value) : value, isRevenue ? 'Source revenue' : 'Orders']}
          contentStyle={{ border: '1px solid #dedbd0', borderRadius: 8, background: '#fffdf8', fontSize: 12 }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#trendFill)" strokeWidth={2.5} dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
