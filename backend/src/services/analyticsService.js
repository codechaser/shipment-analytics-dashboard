import { config } from '../config.js';
import { store } from '../store.js';
import { getCurrencyConversion } from './currencyService.js';
import { getJoinedRecords } from './transformationService.js';

function groupBy(records, keySelector) {
  const groups = new Map();
  for (const record of records) {
    const key = keySelector(record);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  return groups;
}

function filterRecords(records, query) {
  const { dateFrom, dateTo, category, status } = query;
  return records.filter((record) => {
    if (dateFrom && (!record.orderDate || record.orderDate < dateFrom)) return false;
    if (dateTo && (!record.orderDate || record.orderDate > dateTo)) return false;
    if (category && record.category !== category) return false;
    if (status && record.deliveryStatus.toLowerCase() !== status.toLowerCase()) return false;
    return true;
  });
}

function aggregateOrders(records) {
  const byOrder = new Map();
  for (const record of records) {
    if (!byOrder.has(record.orderId)) {
      byOrder.set(record.orderId, {
        ...record,
        totalOrderValue: 0,
        itemCount: 0
      });
    }
    const order = byOrder.get(record.orderId);
    order.totalOrderValue += record.itemTotal || 0;
    order.itemCount += 1;
  }
  return [...byOrder.values()];
}

export function getAnalyticsSummary(query = {}) {
  const filteredRecords = filterRecords(getJoinedRecords(), query);
  const orders = aggregateOrders(filteredRecords);
  const sourceRevenue = orders.reduce((total, order) => total + (order.totalOrderValue || 0), 0);
  const conversion = getCurrencyConversion(sourceRevenue);

  const revenueTrend = [...groupBy(filteredRecords, (record) => record.orderDate || 'Unknown')]
    .map(([date, records]) => {
      const groupedOrders = aggregateOrders(records);
      const revenue = groupedOrders.reduce((total, order) => total + (order.totalOrderValue || 0), 0);
      return {
        date,
        orders: groupedOrders.length,
        sourceRevenue: revenue,
        convertedRevenue: conversion.exchangeRate === null ? null : revenue * conversion.exchangeRate
      };
    })
    .sort((left, right) => left.date.localeCompare(right.date));

  const categoryRevenue = [...groupBy(filteredRecords, (record) => record.category)]
    .map(([categoryName, records]) => ({
      category: categoryName,
      sourceRevenue: records.reduce((total, record) => total + (record.itemTotal || 0), 0),
      convertedRevenue: conversion.exchangeRate === null
        ? null
        : records.reduce((total, record) => total + (record.itemTotal || 0), 0) * conversion.exchangeRate,
      orders: aggregateOrders(records).length,
      items: records.length
    }))
    .sort((left, right) => right.sourceRevenue - left.sourceRevenue);

  const deliveryPerformance = [...groupBy(orders, (order) => order.deliveryStatus)]
    .map(([statusName, groupedOrders]) => ({
      status: statusName,
      orders: groupedOrders.length,
      averageDeliveryDays: groupedOrders.length
        ? groupedOrders.reduce((total, order) => total + (order.deliveryDays || 0), 0) / groupedOrders.length
        : 0
    }));

  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100);
  const start = (page - 1) * pageSize;

  return {
    filters: {
      dateFrom: query.dateFrom || null,
      dateTo: query.dateTo || null,
      category: query.category || null,
      status: query.status || null
    },
    kpis: {
      totalOrders: orders.length,
      totalRevenue: sourceRevenue,
      delayedOrders: orders.filter((order) => order.isDelayed).length
    },
    revenue: conversion,
    revenueTrend,
    categoryRevenue,
    deliveryPerformance,
    dataQuality: {
      unmatchedProducts: filteredRecords.filter((record) => !record.hasProductMatch).length,
      unmatchedShipments: filteredRecords.filter((record) => !record.hasShipmentMatch).length,
      missingCustomers: filteredRecords.filter((record) => !record.hasCustomerData).length,
      invalidQuantities: filteredRecords.filter((record) => !record.hasValidQuantity).length,
      invalidPrices: filteredRecords.filter((record) => !record.hasValidPrice).length,
      invalidItemTotals: filteredRecords.filter((record) => !record.hasValidItemTotal).length,
      ingestion: store.ingestion
    },
    records: {
      items: filteredRecords.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / pageSize)
      }
    },
    metadata: {
      sourceCurrency: config.sourceCurrency,
      generatedAt: new Date().toISOString()
    }
  };
}
