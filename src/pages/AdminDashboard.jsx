import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../api';
import { CATEGORIES, FALLBACK_IMAGE } from '../constants';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Plus,
    Search,
    Bell,
    TrendingUp,
    DollarSign,

    Moon,
    Sun,
    CheckCircle,
    Clock,
    XCircle,
    Trash2,
    Image as ImageIcon,
    X,
    Pencil,
    RefreshCcw,
    Check
} from 'lucide-react';

const PRESET_IMAGES = [
    { name: 'Modern Living', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
    { name: 'Velvet Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
    { name: 'Luxury Bedroom', url: 'https://images.unsplash.com/photo-1505693419173-42b9258a01b6?auto=format&fit=crop&q=80&w=800' },
    { name: 'Minimalist Chair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dining Table', url: 'https://images.unsplash.com/photo-1530018607912-eff2df119d11?auto=format&fit=crop&q=80&w=800' },
    { name: 'Elegant Lamp', url: 'https://images.unsplash.com/photo-1507473884658-c7a36524bb3f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Artistic Decor', url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800' },
    { name: 'Office Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' }
];

const AdminDashboard = ({ products, onAddProduct, onDeleteProduct, onEditProduct, orders = [], onUpdateOrder }) => {
    const [activeView, setActiveView] = useState('overview');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode for now
    const [realCustomers, setRealCustomers] = useState([]);

    useEffect(() => {
        if (activeView === 'customers') {
            api.getAllUsers().then(setRealCustomers).catch(err => console.error("Failed to load users", err));
        }
    }, [activeView]);

    // Safe Orders
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];

    // Stats Calculation
    const stats = useMemo(() => {
        if (!safeOrders.length) return { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, uniqueCustomers: 0 };

        const totalRevenue = safeOrders.reduce((acc, o) => acc + (Number(o?.total) || 0), 0);
        const totalOrders = safeOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const uniqueCustomers = new Set(safeOrders.map(o => o?.customer).filter(Boolean)).size;

        return { totalRevenue, totalOrders, avgOrderValue, uniqueCustomers };
    }, [safeOrders]);

    // Derived Data
    const filteredProducts = safeProducts.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOrders = safeOrders.filter(o =>
        (statusFilter === 'All' || o.status === statusFilter) &&
        (o.id.toString().includes(searchTerm) || (o.customer || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const customers = useMemo(() => {
        const custMap = {};
        safeOrders.forEach(order => {
            if (!order.customer) return;
            if (!custMap[order.customer]) {
                custMap[order.customer] = {
                    name: order.customer,
                    totalSpent: 0,
                    ordersCount: 0,
                    lastOrder: order.date
                };
            }
            custMap[order.customer].totalSpent += (Number(order.total) || 0);
            custMap[order.customer].ordersCount += 1;
        });
        return Object.values(custMap);
    }, [safeOrders]);


    const [editingId, setEditingId] = useState(null);

    // Add/Edit Product Logic
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category: 'Living Room', image: '', description: '', stock: '10'
    });

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                rating: 5 // Default or preserve existing? For now default 5 or handled by backend if missing
            };

            if (editingId) {
                const updated = await api.updateProduct(editingId, productData);
                // We need to notify parent to update list
                if (onEditProduct) onEditProduct(updated);
                alert('Product updated successfully!');
            } else {
                const savedProduct = await api.addProduct(productData);
                onAddProduct(savedProduct);
                alert('Product added successfully!');
            }

            setNewProduct({ name: '', price: '', category: 'Living Room', image: '', description: '', stock: '10' });
            setIsAddProductOpen(false);
            setEditingId(null);
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        }
    };

    const handleEditClick = (product) => {
        setNewProduct({
            name: product.name,
            image: product.image,
            category: product.category,
            price: product.price,
            description: product.description,
            stock: product.stock
        });
        setEditingId(product.id);
        setIsAddProductOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await api.uploadImage(file);
            setNewProduct(prev => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'Cancelled': return 'text-rose-600 bg-rose-50 border-rose-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const theme = {
        bg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
        text: isDarkMode ? 'text-white' : 'text-slate-900',
        cardBg: isDarkMode ? 'bg-slate-800' : 'bg-white',
        cardBorder: isDarkMode ? 'border-slate-700' : 'border-slate-100',
        subText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        inputBg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
        inputBorder: isDarkMode ? 'border-slate-700' : 'border-slate-200',
        thBg: isDarkMode ? 'bg-slate-800' : 'bg-slate-50',
        hoverBg: isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
        headerBg: isDarkMode ? 'bg-slate-800' : 'bg-white',
        headerBorder: isDarkMode ? 'border-slate-700' : 'border-slate-200',
    };

    return (
        <div className={`flex flex-col md:flex-row h-screen font-sans pt-0 ${theme.bg} ${theme.text} transition-colors duration-300`}>
            {/* Mobile Admin Navigation (Bottom Bar) */}
            <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-2xl border shadow-2xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                {[
                    { id: 'overview', icon: LayoutDashboard },
                    { id: 'products', icon: Package },
                    { id: 'orders', icon: ShoppingCart },
                    { id: 'customers', icon: Users },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`p-3 rounded-xl transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <item.icon className="w-5 h-5" />
                    </button>
                ))}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-3 rounded-xl transition-all ${isDarkMode ? 'text-amber-400' : 'text-slate-400'}`}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`w-64 flex-shrink-0 hidden md:flex flex-col border-r ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'} text-white`}>
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">Admin Panel</h3>
                    <p className="text-xl font-serif font-bold">LuxeHomé</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'products', icon: Package, label: 'Products' },
                        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                        { id: 'customers', icon: Users, label: 'Customers' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Dark Mode Toggle in Sidebar */}
                <div className="px-4 pb-2">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all bg-white/5"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">AD</div>
                        <div>
                            <p className="text-sm font-bold text-white">Administrator</p>
                            <p className="text-[10px] text-slate-400">admin@luxehome.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Header */}
                <header className={`${theme.headerBg} ${theme.headerBorder} border-b sticky top-0 z-20 px-8 py-4 flex justify-between items-center transition-colors duration-300`}>
                    <h2 className={`text-2xl font-serif font-bold capitalize ${theme.text}`}>{activeView}</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2 ${theme.inputBg} ${theme.inputBorder} border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-64 ${theme.text}`}
                            />
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                        <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 pb-32 md:pb-8">
                    {/* View Content */}
                    {activeView === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Revenue', val: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50' },
                                    { label: 'Total Orders', val: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-500', bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50' },
                                    { label: 'Customers', val: stats.uniqueCustomers, icon: Users, color: 'text-purple-500', bg: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50' },
                                    { label: 'Avg Order Value', val: `$${Math.round(stats.avgOrderValue)}`, icon: TrendingUp, color: 'text-amber-500', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50' }
                                ].map((stat, i) => (
                                    <div key={i} className={`${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} shadow-sm flex items-center justify-between transition-colors duration-300`}>
                                        <div>
                                            <p className={`text-sm font-medium ${theme.subText} mb-1`}>{stat.label}</p>
                                            <h3 className={`text-2xl font-bold font-serif ${theme.text}`}>{stat.val}</h3>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts & Recent Activity Area */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Sales Chart Placeholder */}
                                <div className={`lg:col-span-2 ${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} shadow-sm transition-colors duration-300`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className={`font-bold text-lg ${theme.text}`}>Revenue Analytics</h3>
                                        <select className={`${theme.inputBg} border-none text-xs font-bold rounded-lg px-3 py-1 outline-none ${theme.subText} cursor-pointer`}>
                                            <option>This Week</option>
                                            <option>This Month</option>
                                            <option>This Year</option>
                                        </select>
                                    </div>
                                    <div className="h-64 flex items-end gap-2 justify-between px-2">
                                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                            <div key={i} className="w-full bg-slate-50/10 rounded-t-lg relative group">
                                                <div
                                                    className="absolute bottom-0 inset-x-2 bg-slate-900 dark:bg-indigo-500 rounded-t-md transition-all duration-1000 group-hover:bg-indigo-600"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <div className={`absolute -bottom-6 inset-x-0 text-center text-[10px] ${theme.subText} font-bold uppercase`}>
                                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Orders Mini */}
                                <div className={`${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} shadow-sm flex flex-col transition-colors duration-300`}>
                                    <h3 className={`font-bold text-lg mb-6 ${theme.text}`}>Recent Activity</h3>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                                        {safeOrders.slice(0, 5).map(order => (
                                            <div key={order.id} className="flex gap-4 items-start">
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg ${getStatusColor(order.status).replace('border', '')}`}>
                                                    {order.status === 'Delivered' ? <CheckCircle className="w-5 h-5" /> : order.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${theme.text}`}>New order from {order.customer}</p>
                                                    <p className={`text-xs ${theme.subText} mb-1`}>Items: {order.items.length} &bull; Total: ${order.total}</p>
                                                    <p className={`text-[10px] uppercase font-bold ${theme.subText}`}>{order.date || 'Today'}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {safeOrders.length === 0 && <p className={`${theme.subText} text-sm italic`}>No recent activity.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'products' && (
                        <div className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} shadow-sm overflow-hidden transition-colors duration-300`}>
                            <div className={`p-6 border-b ${theme.cardBorder} flex justify-between items-center`}>
                                <h3 className={`font-bold text-lg ${theme.text}`}>Product Inventory</h3>
                                <button
                                    onClick={() => setIsAddProductOpen(true)}
                                    className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                >
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`${theme.thBg} border-b ${theme.cardBorder} text-xs uppercase tracking-wider ${theme.subText} font-semibold`}>
                                        <tr>
                                            <th className="p-6">Product</th>
                                            <th className="p-6">Category</th>
                                            <th className="p-6">Price</th>
                                            <th className="p-6">Stock</th>
                                            <th className="p-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                                        {filteredProducts.map(p => (
                                            <tr key={p.id} className={`${theme.hoverBg} transition-colors group`}>
                                                <td className="p-6">
                                                    <div className="flex gap-4 items-center">
                                                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                                                        <span className={`font-medium ${theme.text}`}>{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className={`p-6 text-sm ${theme.subText}`}>{p.category}</td>
                                                <td className={`p-6 text-sm font-bold ${theme.text}`}>${p.price}</td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 w-[80%]"></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-emerald-600">In Stock</span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(p)}
                                                            className="text-slate-300 hover:text-indigo-500 transition-colors p-2 hover:bg-slate-50 rounded-lg"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteProduct(p.id)}
                                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'orders' && (
                        <div className="space-y-6">
                            {/* Filter Bar */}
                            <div className="flex gap-2">
                                {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${statusFilter === status ? 'bg-slate-900 text-white border-slate-900' : `${theme.cardBg} ${theme.subText} ${theme.cardBorder} hover:text-slate-600`}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} shadow-sm overflow-hidden transition-colors duration-300`}>
                                <table className="w-full text-left text-sm">
                                    <thead className={`${theme.thBg} border-b ${theme.cardBorder}`}>
                                        <tr>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Order ID</th>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Customer</th>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Items</th>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Total</th>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Date</th>
                                            <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                                        {filteredOrders.length === 0 ? (
                                            <tr><td colSpan="6" className={`p-12 text-center ${theme.subText} italic`}>No orders found.</td></tr>
                                        ) : (
                                            filteredOrders.map(order => (
                                                <tr key={order.id} className={`${theme.hoverBg} transition-colors`}>
                                                    <td className={`p-6 font-mono ${theme.subText}`}>#{order.id}</td>
                                                    <td className={`p-6 font-medium ${theme.text}`}>{order.customer}</td>
                                                    <td className={`p-6 ${theme.subText}`}>{order.items.length} items</td>
                                                    <td className={`p-6 font-bold ${theme.text}`}>${order.total.toLocaleString()}</td>
                                                    <td className={`p-6 ${theme.subText}`}>{order.date || 'Today'}</td>
                                                    <td className="p-6">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => onUpdateOrder(order.id, e.target.value)}
                                                                className="bg-transparent outline-none cursor-pointer appearance-none pr-2"
                                                            >
                                                                <option value="Processing">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'customers' && (
                        <div className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} shadow-sm overflow-hidden transition-colors duration-300`}>
                            <div className={`p-6 border-b ${theme.cardBorder}`}>
                                <h3 className={`font-bold text-lg ${theme.text}`}>Registered Users (Database)</h3>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className={`${theme.thBg} border-b ${theme.cardBorder}`}>
                                    <tr>
                                        <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>User</th>
                                        <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Email</th>
                                        <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Role</th>
                                        <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Orders</th>
                                        <th className={`p-6 font-bold ${theme.subText} uppercase tracking-widest text-[10px]`}>Joined</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                                    {realCustomers.map((cust) => {
                                        const userOrders = safeOrders.filter(o => o.customer === cust.name);
                                        return (
                                            <tr key={cust.id} className={`${theme.hoverBg} transition-colors`}>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold`}>
                                                            {(cust.name || '?').substring(0, 1).toUpperCase()}
                                                        </div>
                                                        <span className={`font-medium ${theme.text}`}>{cust.name}</span>
                                                    </div>
                                                </td>
                                                <td className={`p-6 ${theme.subText}`}>{cust.email}</td>
                                                <td className={`p-6`}>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${cust.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {cust.role}
                                                    </span>
                                                </td>
                                                <td className={`p-6 font-medium ${theme.text}`}>{userOrders.length}</td>
                                                <td className={`p-6 ${theme.subText}`}>{cust.created_at ? new Date(cust.created_at).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                        );
                                    })}
                                    {realCustomers.length === 0 && <tr><td colSpan="5" className={`p-12 text-center italic ${theme.subText}`}>Loading users or none found...</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Product Modal (Always Light Mode for readability for now, or match theme) */}
            {isAddProductOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsAddProductOpen(false); setEditingId(null); }}></div>
                    <div className={`relative ${theme.cardBg} w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]`}>
                        <div className={`p-6 border-b ${theme.cardBorder} flex justify-between items-center ${theme.thBg}`}>
                            <h3 className={`text-xl font-serif font-bold ${theme.text}`}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => { setIsAddProductOpen(false); setEditingId(null); }} className={`p-2 ${theme.hoverBg} rounded-full transition-colors ${theme.subText}`}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <form className="space-y-6" onSubmit={handleSubmitProduct}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Product Name</label>
                                        <input
                                            className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium ${theme.text}`}
                                            placeholder="e.g. Velvet Sofa"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Category</label>
                                        <select
                                            className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium appearance-none ${theme.text}`}
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Price ($)</label>
                                        <input
                                            type="number"
                                            className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium ${theme.text}`}
                                            placeholder="0.00"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Stock Quantity</label>
                                        <input
                                            type="number"
                                            className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium ${theme.text}`}
                                            placeholder="10"
                                            value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Image</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium ${theme.text}`}
                                                placeholder="https://... or upload file"
                                                value={newProduct.image}
                                                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className={`w-full text-xs ${theme.subText} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100`}
                                            />
                                        </div>
                                        <div className={`w-20 h-20 ${theme.inputBg} rounded-xl flex items-center justify-center flex-shrink-0 border ${theme.inputBorder} overflow-hidden shadow-inner`}>
                                            {newProduct.image ? <img src={newProduct.image} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMAGE }} /> : <ImageIcon className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Premium Preset Gallery */}
                                    <div className="mt-4">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.subText} mb-3`}>Quick Select Premium Images</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                            {PRESET_IMAGES.map((img, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setNewProduct({ ...newProduct, image: img.url })}
                                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${newProduct.image === img.url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent'}`}
                                                    title={img.name}
                                                >
                                                    <img src={img.url} className="w-full h-full object-cover" />
                                                    {newProduct.image === img.url && (
                                                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-widest ${theme.subText}`}>Description</label>
                                    <textarea
                                        className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium h-32 resize-none ${theme.text}`}
                                        placeholder="Detailed product description..."
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => { setIsAddProductOpen(false); setEditingId(null); }} className={`flex-1 py-4 rounded-xl font-bold border ${theme.inputBorder} ${theme.hoverBg} transition-all ${theme.subText}`}>Cancel</button>
                                    <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl">{editingId ? 'Update Product' : 'Create Product'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
