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

    // Manual parsing for problematic connection strings
    // Format: postgresql://username:password@host:port/database
    const match = uri.match(
      /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
    );

    if (match) {
      const [, username, password, host, port, database] = match;
      return new Client({
        user: username,
        password: password, // Use password as-is from the match
        host: host,
        port: parseInt(port),
        database: database,
        ssl: useSSL ? { rejectUnauthorized: false } : false,
      });
    } else {
      throw new Error(`Unable to parse connection string: ${uri}`);
    }
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
