import express from 'express';
import cors from 'cors';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads dir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// --- FILE UPLOAD ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// --- PRODUCTS ROUTES ---

// Get all products
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add product
app.post('/products', async (req, res) => {
    try {
        const { name, price, category, image, description, rating, stock } = req.body;
        const result = await pool.query(
            'INSERT INTO products (name, price, category, image, description, rating, stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, price, category, image, description, rating || 5, stock || 10]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, description, rating, stock } = req.body;
        const result = await pool.query(
            'UPDATE products SET name=$1, price=$2, category=$3, image=$4, description=$5, rating=$6, stock=$7 WHERE id=$8 RETURNING *',
            [name, price, category, image, description, rating, stock, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- USERS ROUTES (Auth) ---

// Login / Check User (Simplified for demo)
app.get('/users', async (req, res) => {
    try {
        const { email, password } = req.query;
        let query = 'SELECT * FROM users WHERE email = $1';
        let params = [email];

        if (password) {
            query += ' AND password = $2';
            params.push(password);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users (Admin)
app.get('/users/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Signup
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role || 'user']
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- ORDERS ROUTES ---

// Get all orders
app.get('/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create Order
app.post('/orders', async (req, res) => {
    try {
        const { customer, total, status, items, date } = req.body;
        console.log('--- NEW ORDER RECEIVED ---');
        console.log('Customer:', customer);
        console.log('Total:', total);

        // Ensure items is a JSON string for PG
        const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);

        const result = await pool.query(
            'INSERT INTO orders (customer, total, status, items, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [customer, total, status || 'Processing', itemsJson, date || new Date().toISOString().split('T')[0]]
        );

        console.log('Order saved with ID:', result.rows[0].id);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('ERROR SAVING ORDER:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// --- REVIEWS ROUTES ---

// Get reviews for a product
app.get('/reviews/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC',
            [productId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a review
app.post('/reviews', async (req, res) => {
    try {
        const { product_id, customer_name, customer_email, rating, comment } = req.body;
        const result = await pool.query(
            'INSERT INTO reviews (product_id, customer_name, customer_email, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [product_id, customer_name, customer_email, rating, comment]
        );

        // Update product average rating (optional but professional)
        await pool.query(
            'UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1) WHERE id = $1',
            [product_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- COUPON ROUTES ---

// Validate coupon
app.get('/coupons/validate', async (req, res) => {
    try {
        const { code, total } = req.query;
        if (!code) return res.status(400).json({ error: 'Coupon code required' });

        const result = await pool.query(
            'SELECT * FROM coupons WHERE code = $1 AND is_active = true',
            [code.toUpperCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invalid or inactive coupon code' });
        }

        const coupon = result.rows[0];

        // Check expiry
        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
            return res.status(400).json({ error: 'Coupon code has expired' });
        }

        // Check min purchase
        if (total && parseFloat(total) < parseFloat(coupon.min_purchase)) {
            return res.status(400).json({
                error: `Minimum purchase of ₹${parseFloat(coupon.min_purchase).toLocaleString()} required for this coupon`
            });
        }

        res.json(coupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
