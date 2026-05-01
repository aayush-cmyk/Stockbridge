const { Pool } = require('pg');

let pool = null;

let pool = null;
let dbPromise = null;

// Use PostgreSQL if DATABASE_URL is present, otherwise use SQLite
const usePostgres = process.env.DATABASE_URL;

if (usePostgres) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon / Supabase
  });
  console.log('Using PostgreSQL database');
} else {
  const sqlite3 = require('sqlite3').verbose();
  const { open } = require('sqlite');
  dbPromise = open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  console.log('Using SQLite database');
}

module.exports = {
  execute: async (sql, params = []) => {
    if (usePostgres) {
      // Convert SQLite parameter markers (?) to PostgreSQL markers ($1, $2, ...)
      let pgSql = sql;
      let count = 1;
      while (pgSql.includes('?')) {
        pgSql = pgSql.replace('?', `$${count++}`);
      }

      const trimmed = sql.trim().toUpperCase();

      // For INSERT, append RETURNING id so we can retrieve the new row's id
      if (trimmed.startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      const res = await pool.query(pgSql, params);

      if (trimmed.startsWith('SELECT')) {
        return [res.rows];
      } else if (trimmed.startsWith('INSERT')) {
        return [{
          insertId: res.rows[0]?.id || null,
          affectedRows: res.rowCount
        }];
      } else {
        // UPDATE, DELETE, etc.
        return [{
          insertId: null,
          affectedRows: res.rowCount
        }];
      }
    } else {
      const db = await dbPromise;
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        const rows = await db.all(sql, params);
        return [rows];
      } else {
        const result = await db.run(sql, params);
        return [{ insertId: result.lastID, affectedRows: result.changes }];
      }
    }
  }
};
