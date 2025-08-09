"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// Get the database URI
const dbUri = getDatabaseUri();

// Helper function to create client from connection string with manual parsing
function createClientFromUri(uri, useSSL = false) {
  try {
    // Try direct connection string first
    return new Client({
      connectionString: uri,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    });
  } catch (error) {
    console.log("Direct connection failed, parsing manually...");
    // Parse manually if connection string parsing fails
    const url = new URL(uri);
    return new Client({
      user: url.username,
      password: decodeURIComponent(url.password),
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    });
  }
}

if (process.env.NODE_ENV === "production") {
  // Production environment (Render)
  db = createClientFromUri(dbUri, true);
} else {
  // Development environment
  if (
    dbUri &&
    (dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://"))
  ) {
    db = createClientFromUri(dbUri, false);
  } else {
    // Local development - use connection object
    db = new Client({
      database: dbUri || "jobly",
      host: "localhost",
      port: 5432,
    });
  }
}

db.connect();

module.exports = db;
