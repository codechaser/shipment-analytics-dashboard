import { ArrowUpRight, CalendarDays, Clock3, Package, X } from 'lucide-react';
import { useState } from 'react';

function groupOrders(records) {
  const orders = new Map();
  records.forEach((record) => {
    if (!orders.has(record.orderId)) {
      orders.set(record.orderId, {
        orderId: record.orderId,
        customerId: record.customerId,
        customerName: record.customerName,
        orderDate: record.orderDate,
        totalOrderValue: record.totalOrderValue,
        deliveryStatus: record.deliveryStatus,
        deliveryDays: record.deliveryDays,
        products: []
      });
    }
    orders.get(record.orderId).products.push(record);
  });
  return [...orders.values()];
}

function OrderDetail({ order, onClose }) {
  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
        <div className="detail-dialog__header">
          <div>
            <span className="section-kicker">Order drill-down</span>
            <h2 id="order-detail-title">Order #{order.orderId}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close order details" aria-label="Close order details"><X size={18} /></button>
        </div>
        <div className="detail-summary">
          <div><span>Customer</span><strong>{order.customerName || 'Unknown customer'}</strong><small>{order.customerId || 'No customer ID'}</small></div>
          <div><span>Order date</span><strong>{order.orderDate || 'Unavailable'}</strong><small><CalendarDays size={13} /> Placed date</small></div>
          <div><span>Total order value</span><strong>{order.totalOrderValue === null ? 'Unavailable' : order.totalOrderValue.toLocaleString('en-IN')}</strong><small><Package size={13} /> Source revenue</small></div>
          <div><span>Shipment</span><strong><span className={`status-tag status-tag--${order.deliveryStatus.toLowerCase()}`}>{order.deliveryStatus}</span></strong><small><Clock3 size={13} /> {order.deliveryDays === null ? 'Days unavailable' : `${order.deliveryDays} delivery days`}</small></div>
        </div>
        <div className="detail-products">
          <div className="detail-products__heading"><span>Products in this order</span><strong>{order.products.length} line{order.products.length === 1 ? '' : 's'}</strong></div>
          {order.products.map((product) => (
            <div className="detail-product" key={`${product.orderId}-${product.productId}`}>
              <div><strong>{product.productName || product.productId || 'Unknown product'}</strong><span>{product.productId || 'No product ID'} · {product.category}</span></div>
              <div className="detail-product__numbers"><span>{product.quantity ?? '—'} × {product.unitPrice ?? '—'}</span><strong>{product.itemTotal === null ? 'Unavailable' : product.itemTotal.toLocaleString('en-IN')}</strong></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function RecordsTable({ records }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const orders = groupOrders(records);
  const selectedOrder = orders.find((order) => order.orderId === selectedOrderId);

  return (
    <section className="records-panel">
      <div className="records-panel__header">
        <div>
          <span className="section-kicker">Joined records</span>
          <h2>Order detail</h2>
        </div>
        <span className="record-count">{records.length} lines · click an order <ArrowUpRight size={15} /></span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Product</th><th>Category</th><th>Item total</th><th>Delivery days</th><th>Status</th></tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.orderId}-${record.productId}`} className="table-row--interactive" onClick={() => setSelectedOrderId(record.orderId)}>
                <td className="table-emphasis"><button className="order-link" type="button" onClick={() => setSelectedOrderId(record.orderId)}>#{record.orderId}</button></td>
                <td>{record.customerName || 'Unknown customer'}</td>
                <td>{record.productName || record.productId || 'Unknown product'}</td>
                <td><span className="category-tag">{record.category}</span></td>
                <td>{record.itemTotal === null ? 'Unavailable' : record.itemTotal.toLocaleString('en-IN')}</td>
                <td>{record.deliveryDays === null ? 'Unavailable' : record.deliveryDays}</td>
                <td><span className={`status-tag status-tag--${record.deliveryStatus.toLowerCase()}`}>{record.deliveryStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrderId(null)} />}
    </section>
  );
}
