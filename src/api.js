
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://luxehome-backend.onrender.com'; // Default production fallback

export const api = {
    // Products
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        return res.json();
    },
    addProduct: async (product) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        return res.json();
    },
    deleteProduct: async (id) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    },
    updateProduct: async (id, product) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        return res.json();
    },

    // Users (Auth)
    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (!res.ok) throw new Error('Login request failed');
            const users = await res.json();
            return users[0]; // Returns user if found, undefined if not
        } catch (err) {
            console.error("Login Error:", err);
            throw err;
        }
    },
    signup: async (user) => {
        try {
            // Check if user exists first
            const check = await fetch(`${API_URL}/users?email=${encodeURIComponent(user.email)}`);
            if (check.ok) {
                const existing = await check.json();
                if (existing.length > 0) throw new Error('An account with this email already exists.');
            }

            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || 'Failed to create account');
            }

            return res.json();
        } catch (err) {
            console.error("Signup Error:", err);
            throw err;
        }
    },
    getAllUsers: async () => {
        const res = await fetch(`${API_URL}/users/all`);
        return res.json();
    },

    // Orders
    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`);
        return res.json();
    },
    createOrder: async (order) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        return res.json();
    },
    updateOrder: async (id, updates) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        return res.json();
    },

    // File Upload
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
    },

    // Reviews
    getReviews: async (productId) => {
        const res = await fetch(`${API_URL}/reviews/${productId}`);
        return res.json();
    },
    addReview: async (review) => {
        const res = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        return res.json();
    },
    validateCoupon: async (code, total) => {
        const res = await fetch(`${API_URL}/coupons/validate?code=${encodeURIComponent(code)}&total=${total}`);
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Invalid coupon');
        }
        return res.json();
    }
};
