const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.run("ALTER TABLE products ADD COLUMN unit TEXT DEFAULT 'unit'", (err) => {
  if (err) console.log(err.message);
  else console.log('Unit column added');
});
