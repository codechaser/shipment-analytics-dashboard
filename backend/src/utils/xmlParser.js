import { XMLParser } from 'fast-xml-parser';
import { HttpError } from './httpError.js';
import { normalizeText, toNumber } from './typeConversion.js';

const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === 'shipment'
});

export function parseShipmentsXml(rawText) {
  let parsed;

  try {
    parsed = parser.parse(rawText);
  } catch (error) {
    throw new HttpError(422, 'Shipment.xml could not be parsed.', { cause: error.message });
  }

  const shipments = parsed?.shipments?.shipment;
  if (!Array.isArray(shipments)) {
    throw new HttpError(422, 'Shipment.xml must contain a shipments.shipment collection.');
  }

  const warnings = [];
  const records = shipments.map((shipment, index) => {
    const deliveryDays = toNumber(shipment.delivery_days);
    const orderId = normalizeText(shipment.order_id);
    const status = normalizeText(shipment.status);

    if (!orderId) warnings.push(`Shipment at index ${index} has no order_id.`);
    if (deliveryDays === null || deliveryDays < 0) warnings.push(`Shipment at index ${index} has invalid delivery_days.`);
    if (!status) warnings.push(`Shipment at index ${index} has no status.`);

    return {
      shipmentId: normalizeText(shipment.shipment_id),
      orderId,
      deliveryDays,
      status
    };
  });

  return { records, warnings };
}
