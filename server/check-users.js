import pool from './db.js';

const checkUsers = async () => {
    try {
        console.log("Connecting to database...");
        const res = await pool.query('SELECT id, name, email, role FROM users');
        console.log("\n--- USERS IN 'luxima home' DATABASE ---");
        console.table(res.rows);
        console.log("---------------------------------------\n");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

checkUsers();
