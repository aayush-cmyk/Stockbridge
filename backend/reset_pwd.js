const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function resetPassword() {
  const email = 'supplier@test.com';
  const newPassword = 'password123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    if (result.affectedRows > 0) {
      console.log(`Password for ${email} has been reset to "${newPassword}"`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

resetPassword();
