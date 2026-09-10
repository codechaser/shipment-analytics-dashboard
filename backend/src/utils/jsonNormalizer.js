import { HttpError } from './httpError.js';
import { normalizeText, toDateString, toNumber } from './typeConversion.js';

function removeLineQuoting(rawText) {
  return rawText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        return trimmedLine.slice(1, -1).replaceAll('""', '"');
      }
      return line;
    })
    .join('\n');
}

export function parseOrdersJson(rawText) {
  const cleanText = rawText.replace(/^\uFEFF/, '');
  let parsed;

  try {
    parsed = JSON.parse(cleanText);
  } catch {
    try {
      parsed = JSON.parse(removeLineQuoting(rawText));
    } catch (error) {
      throw new HttpError(422, 'Orders.json is not valid JSON and could not be normalized.', {
        cause: error.message
      });
    }
  }

  if (!Array.isArray(parsed.orders)) {
    throw new HttpError(422, 'Orders.json must contain an orders array.');
  }

  const warnings = [];
  const flattenedOrders = [];

  for (const [orderIndex, order] of parsed.orders.entries()) {
    const orderId = normalizeText(order.order_id);
    const items = Array.isArray(order.items) ? order.items : [];
    const customerId = normalizeText(order.customer?.id);
    const customerName = normalizeText(order.customer?.name);
    const orderDate = toDateString(order.order_date);

    if (!orderId) {
      warnings.push(`Order at index ${orderIndex} has no order_id.`);
      continue;
    }

    if (!customerId && !customerName) {
      warnings.push(`Order ${orderId} has no customer data.`);
    }
    if (!orderDate) {
      warnings.push(`Order ${orderId} has an invalid order_date.`);
    }

    if (items.length === 0) {
      warnings.push(`Order ${orderId} has no items.`);
    }

    let totalOrderValue = 0;
    let hasInvalidOrderValue = false;
    for (const item of items) {
      const quantity = toNumber(item.qty ?? item.quantity);
      const price = toNumber(item.price);
      if (quantity === null || quantity < 0 || price === null || price < 0) {
        hasInvalidOrderValue = true;
        continue;
      }
      totalOrderValue += quantity * price;
    }
    if (hasInvalidOrderValue) {
      totalOrderValue = null;
    }

    for (const [itemIndex, item] of items.entries()) {
      const productId = normalizeText(item.product_id ?? item.productId);
      const quantity = toNumber(item.qty ?? item.quantity);
      const unitPrice = toNumber(item.price);
      const itemTotal = quantity !== null && quantity >= 0 && unitPrice !== null && unitPrice >= 0
        ? quantity * unitPrice
        : null;

      if (!productId) {
        warnings.push(`Order ${orderId} item ${itemIndex} has no product_id.`);
      }
      if (quantity === null || quantity < 0) {
        warnings.push(`Order ${orderId} item ${itemIndex} has an invalid quantity.`);
      }
      if (unitPrice === null || unitPrice < 0) {
        warnings.push(`Order ${orderId} item ${itemIndex} has an invalid price.`);
      }

      flattenedOrders.push({
        orderId,
        customerId,
        customerName,
        orderDate,
        productId,
        quantity,
        unitPrice,
        totalOrderValue,
        itemTotal,
        lineValue: itemTotal,
        hasValidItemTotal: itemTotal !== null
      });
    }
  }

  return { records: flattenedOrders, warnings };
}
