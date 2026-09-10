import { ingestCsv, ingestJson, ingestXml } from '../services/ingestionService.js';

function ingestionResponse(source, result) {
  return {
    success: true,
    source,
    recordCount: result.records.length,
    warnings: result.warnings,
    records: result.records
  };
}

export async function ingestJsonController(request, response) {
  const result = await ingestJson();
  response.status(200).json(ingestionResponse('Orders.json', result));
}

export async function ingestXmlController(request, response) {
  const result = await ingestXml();
  response.status(200).json(ingestionResponse('Shipment.xml', result));
}

export async function ingestCsvController(request, response) {
  const result = await ingestCsv();
  response.status(200).json(ingestionResponse('Products.csv', result));
}
