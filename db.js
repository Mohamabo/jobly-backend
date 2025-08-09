"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // For development, use connection object instead of connection string
  // if DATABASE_URL is not a full URL
  const dbUri = getDatabaseUri();
  if (dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://")) {
    db = new Client({
      connectionString: dbUri,
    });
  } else {
    // Treat as database name only
    db = new Client({
      database: dbUri,
      host: "localhost",
      port: 5432,
    });
  }
}

db.connect();

module.exports = db;
