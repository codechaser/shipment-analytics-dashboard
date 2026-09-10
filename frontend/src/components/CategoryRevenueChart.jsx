import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const palette = ['#0e7c7b', '#e0704d', '#d8a649', '#5a7184', '#9a6277'];
const numberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export default function CategoryRevenueChart({ data, onCategorySelect }) {
  if (!data.length) {
    return <div className="chart-empty">No category data matches these filters.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 18, left: 2, bottom: 0 }} onClick={(state) => {
        const category = state?.activePayload?.[0]?.payload?.category;
        if (category) onCategorySelect(category);
      }}>
        <CartesianGrid horizontal={false} stroke="#d9d6ca" strokeDasharray="3 5" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#73746e', fontSize: 11 }} tickFormatter={(value) => numberFormatter.format(value)} />
        <YAxis type="category" dataKey="category" width={82} tickLine={false} axisLine={false} tick={{ fill: '#40433f', fontSize: 12 }} />
        <Tooltip formatter={(value) => [numberFormatter.format(value), 'Source revenue']} contentStyle={{ border: '1px solid #dedbd0', borderRadius: 8, background: '#fffdf8', fontSize: 12 }} />
        <Bar dataKey="sourceRevenue" radius={[0, 5, 5, 0]} barSize={25} cursor="pointer">
          {data.map((entry, index) => <Cell key={entry.category} fill={palette[index % palette.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
