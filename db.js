"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// Get the database URI
const dbUri = getDatabaseUri();

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: dbUri,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // For development, check if we have a full connection string
  if (
    dbUri &&
    (dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://"))
  ) {
    db = new Client({
      connectionString: dbUri,
    });
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
