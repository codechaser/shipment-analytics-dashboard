import { store } from '../store.js';

export function getJoinedRecords() {
  const productsById = new Map(store.products.map((product) => [product.productId, product]));
  const shipmentsByOrderId = new Map(store.shipments.map((shipment) => [shipment.orderId, shipment]));

  return store.orders.map((order) => {
    const product = productsById.get(order.productId);
    const shipment = shipmentsByOrderId.get(order.orderId);

    return {
      ...order,
      total_order_value: order.totalOrderValue,
      item_total: order.itemTotal,
      productName: product?.productName || null,
      category: product?.category || 'Uncategorized',
      shipmentId: shipment?.shipmentId || null,
      deliveryDays: shipment?.deliveryDays ?? null,
      deliveryStatus: shipment?.status || 'Unknown',
      isDelayed: shipment?.status?.toLowerCase() === 'delayed',
      hasCustomerData: Boolean(order.customerId || order.customerName),
      hasProductMatch: Boolean(product),
      hasShipmentMatch: Boolean(shipment),
      hasValidQuantity: order.quantity !== null && order.quantity >= 0,
      hasValidPrice: order.unitPrice !== null && order.unitPrice >= 0
    };
  });
}
