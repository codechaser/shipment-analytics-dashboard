export const store = {
  orders: [],
  shipments: [],
  products: [],
  ingestion: {
    json: null,
    xml: null,
    csv: null
  }
};

export function replaceCollection(collectionName, records) {
  store[collectionName] = records;
}

export function recordIngestion(source, details) {
  store.ingestion[source] = {
    ...details,
    ingestedAt: new Date().toISOString()
  };
}
