const mysql = require('mysql2/promise');

// Same MySQL config as server.js
const config = {
  host: 'localhost',
  user: 'root',
  password: 'Rakwa5678@',
  database: 'travel'
};

async function setPassword() {
    try {
        const pool = await mysql.createConnection(config);

        // Change these values to set password for different users
        const username = 'testuser';  // Change this to the username you want
        const plainPassword = 'test12345';  // Change this to the password you want
        await pool.query(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            [plainPassword, username] // storing plain text (user requested)
        );

        console.log(`✅ Password set for ${username}`);
        await pool.end();
        process.exit();

    } catch(err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

setPassword();

