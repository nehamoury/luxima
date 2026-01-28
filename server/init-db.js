import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql on database...');
        await pool.query(schemaSql);

        // Sync Sequences (Fixes duplicate ID error if data exists)
        try {
            await pool.query("SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products)+1, 1), false)");
            await pool.query("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users)+1, 1), false)");
            await pool.query("SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders)+1, 1), false)");
        } catch (seqErr) {
            console.warn("Sequence sync warning:", seqErr.message);
        }

        // ALTER rating column to allow decimals (Fixes 4.8 crash)
        try {
            await pool.query("ALTER TABLE products ALTER COLUMN rating TYPE NUMERIC");
        } catch (e) {
            console.log("Rating column alter skipped or failed");
        }

        // Fix orders table if missing date or has wrong types
        try {
            await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE");
            await pool.query("ALTER TABLE orders ALTER COLUMN total TYPE NUMERIC");
        } catch (e) {
            console.log("Orders table fix skipped or failed:", e.message);
        }

        // Read from db.json
        const dbJsonPath = path.join(__dirname, '../db.json');
        console.log(`Reading data from ${dbJsonPath}...`);

        let products = [];
        let users = [];
        if (fs.existsSync(dbJsonPath)) {
            const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
            products = dbData.products || [];
            users = dbData.users || [];
        } else {
            console.warn("db.json not found, skipping seed.");
        }

        // Seed Users
        console.log(`Seeding ${users.length} users...`);
        for (const u of users) {
            const uCheck = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
            if (uCheck.rows.length === 0) {
                await pool.query(
                    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                    [u.name, u.email, u.password, u.role || 'user']
                );
                console.log(`Added user: ${u.name}`);
            }
        }

        // Ensure Admin exists (redundant if in db.json but safe)
        const adminCheck = await pool.query("SELECT id FROM users WHERE email = 'admin@luxehome.com'");
        if (adminCheck.rows.length === 0) {
            await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                ['Administrator', 'admin@luxehome.com', 'admin123', 'admin']
            );
            console.log('Admin user created (fallback).');
        }

        // Seed Products
        console.log(`Seeding ${products.length} products...`);
        for (const p of products) {
            // Check by name to avoid duplicates
            const check = await pool.query('SELECT id FROM products WHERE name = $1', [p.name]);
            if (check.rows.length === 0) {
                await pool.query(
                    'INSERT INTO products (name, category, price, image, description, rating, stock) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [
                        p.name,
                        p.category,
                        p.price,
                        p.image,
                        p.description,
                        p.rating || 5,
                        p.stock ? Number(p.stock) : 10
                    ]
                );
                console.log(`Added product: ${p.name}`);
            } else {
                console.log(`Skipped product (exists): ${p.name}`);
            }
        }

        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
};

initDb();
