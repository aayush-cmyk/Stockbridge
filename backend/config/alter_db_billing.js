const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function migrate() {
  console.log("Migrating database for billing...");
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Add address and gstin to users
    try {
      await db.run('ALTER TABLE users ADD COLUMN address TEXT');
      console.log("Added column 'address' to users table.");
    } catch (e) { console.log("Column 'address' already exists."); }

    try {
      await db.run('ALTER TABLE users ADD COLUMN gstin TEXT');
      console.log("Added column 'gstin' to users table.");
    } catch (e) { console.log("Column 'gstin' already exists."); }

    // Add invoice_number to orders
    try {
      await db.run('ALTER TABLE orders ADD COLUMN invoice_number TEXT');
      console.log("Added column 'invoice_number' to orders table.");
    } catch (e) { console.log("Column 'invoice_number' already exists."); }

    await db.close();
    console.log("Migration completed.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
