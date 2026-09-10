import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { replaceCollection, recordIngestion } from '../store.js';
import { parseOrdersJson } from '../utils/jsonNormalizer.js';
import { parseShipmentsXml } from '../utils/xmlParser.js';
import { parseProductsCsv } from '../utils/csvParser.js';

async function readDataFile(fileName) {
  return readFile(path.join(config.dataDirectory, fileName), 'utf8');
}

export async function ingestJson() {
  const result = parseOrdersJson(await readDataFile('Orders.json'));
  replaceCollection('orders', result.records);
  recordIngestion('json', { recordCount: result.records.length, warnings: result.warnings });
  return result;
}

export async function ingestXml() {
  const result = parseShipmentsXml(await readDataFile('Shipment.xml'));
  replaceCollection('shipments', result.records);
  recordIngestion('xml', { recordCount: result.records.length, warnings: result.warnings });
  return result;
}

export async function ingestCsv() {
  const result = parseProductsCsv(await readDataFile('Products.csv'));
  replaceCollection('products', result.records);
  recordIngestion('csv', { recordCount: result.records.length, warnings: result.warnings });
  return result;
}
