# Shipment Analytics Dashboard

A full-stack Shipment Analytics Dashboard that processes order, shipment, and product data from JSON, XML, and CSV formats and converts it into meaningful business analytics through an interactive React dashboard.

## 🚀 Live Demo

https://shipment-analytics-dashboard-two.vercel.app/

## 🔗 Backend API

https://shipment-analytics-dashboard.onrender.com/

## 📌 Project Overview

The Shipment Analytics Dashboard is designed to integrate shipment-related data available in different formats.

The application:

- Ingests order data from JSON
- Ingests shipment data from XML
- Ingests product data from CSV
- Normalizes and processes the data
- Flattens nested order-item data
- Joins orders, shipments, and products
- Calculates total order value and revenue
- Identifies delayed orders
- Performs category-wise revenue aggregation
- Provides interactive analytics through a React dashboard

## 🏗️ Architecture

```text
Orders.json ─────┐
                 │
Shipment.xml ────┼──> Node.js + Express
                 │          │
Products.csv ────┘          ↓
                     Parse & Normalize
                            ↓
                       Join Datasets
                            ↓
                      Data Analytics
                            ↓
                       REST APIs
                            ↓
                    React + Vite Frontend
                            ↓
                    Interactive Dashboard
