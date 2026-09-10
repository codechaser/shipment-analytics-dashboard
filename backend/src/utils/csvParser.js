import { parse } from 'csv-parse/sync';
import { HttpError } from './httpError.js';
import { normalizeText } from './typeConversion.js';

export function parseProductsCsv(rawText) {
  const normalizedText = rawText
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
  let rows;

  try {
    rows = parse(normalizedText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true
    });
  } catch (error) {
    throw new HttpError(422, 'Products.csv could not be parsed.', { cause: error.message });
  }

  const warnings = [];
  const records = rows.map((row, index) => {
    const productId = normalizeText(row.ProductID ?? row.product_id ?? row.productId);
    const productName = normalizeText(row.ProductName ?? row.product_name ?? row.productName);
    const category = normalizeText(row.Category ?? row.category);

    if (!productId) warnings.push(`Product at row ${index + 2} has no product ID.`);
    if (!productName) warnings.push(`Product ${productId || `at row ${index + 2}`} has no name.`);
    if (!category) warnings.push(`Product ${productId || `at row ${index + 2}`} has no category.`);

    return { productId, productName, category };
  });

  return { records, warnings };
}
