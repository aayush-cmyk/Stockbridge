const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function alterDB() {
  console.log("Altering SQLite database for Razorpay...");
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Add razorpay columns to orders table
    // SQLite doesn't support adding multiple columns in a single ALTER TABLE statement, so we do them one by one.
    // Also using IF NOT EXISTS logic via pragma info or try-catch since SQLite ALTER TABLE ADD COLUMN doesn't support IF NOT EXISTS.
    
    const columnsToAdd = [
      "razorpay_order_id TEXT",
      "razorpay_payment_id TEXT",
      "razorpay_signature TEXT"
    ];

    for (const colDef of columnsToAdd) {
      try {
        await db.exec(`ALTER TABLE orders ADD COLUMN ${colDef};`);
        console.log(`Added column: ${colDef.split(' ')[0]}`);
      } catch (e) {
        if (e.message.includes('duplicate column name')) {
          console.log(`Column already exists: ${colDef.split(' ')[0]}`);
        } else {
          console.error(`Failed to add column ${colDef.split(' ')[0]}:`, e.message);
        }
      }
    }

    console.log("Database altered successfully.");
    await db.close();
  } catch (error) {
    console.error("Failed to alter database:", error);
  }
}

alterDB();
