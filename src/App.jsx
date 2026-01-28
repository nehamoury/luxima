import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import {
    ShoppingBag,
    Search,
    Menu,
    X,
    Heart,
    User as UserIcon,
    LogOut,
    Plus,
    Minus,
    Trash2
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, FALLBACK_IMAGE } from './constants';
import { api } from './api';

// Components
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import CollectionsPage from './pages/CollectionsPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import OurCraftPage from './pages/OurCraftPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState(PRODUCTS); // Init with fallback
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // Fetch Data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only try to fetch if we are NOT on Netlify or if we have a working backend
                const [prods, ords] = await Promise.all([
                    api.getProducts(),
                    api.getOrders()
                ]);

                if (Array.isArray(prods) && prods.length > 0) {
                    setProducts(prods);
                }
                if (Array.isArray(ords)) {
                    setOrders(ords);
                }
            } catch (err) {
                console.log("Backend not detected, using premium static defaults.");
                // Fallback is already set in useState(PRODUCTS)
            }
        };
        fetchData();
    }, []);

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('luxehome-user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('luxehome-cart');
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('luxehome-wishlist');
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNavScrolled, setIsNavScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('luxehome-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('luxehome-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        if (user) localStorage.setItem('luxehome-user', JSON.stringify(user));
        else localStorage.removeItem('luxehome-user');
    }, [user]);

    useEffect(() => {
        const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, products]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const isExist = prev.some(item => item.id === product.id);
            if (isExist) return prev.filter(item => item.id !== product.id);
            return [...prev, product];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (!user) {
            setIsCartOpen(false);
            setIsAuthModalOpen(true);
            return;
        }
        setIsCartOpen(false);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        const newOrder = {
            id: Date.now(),
            customer: user.name,
            total: cartTotal,
            status: 'Processing',
            items: cart,
            date: new Date().toISOString().split('T')[0] // Use YYYY-MM-DD for Postgres DATE column
        };

        try {
            const savedOrder = await api.createOrder(newOrder);
            setOrders(prev => [savedOrder, ...prev]);
            setCart([]);
            setIsPaymentModalOpen(false);
            // alert('Order placed successfully! Thank you for your purchase.');
        } catch (error) {
            console.error('Failed to create order', error);
            alert('Checkout failed. Please try again.');
            setIsPaymentModalOpen(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product');
        }
    };

    const handleUpdateOrder = async (id, status) => {
        try {
            await api.updateOrder(id, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) {
            console.error('Failed to update order', error);
            alert('Failed to update order status');
        }
    };

    const handleEditProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    useEffect(() => {
        if (location.pathname === '/admin') {
            if (!user || user.role !== 'admin') {
                setIsAuthModalOpen(true);
            }
        }
    }, [location.pathname, user]);

    // Render Logic
    if (user?.role === 'admin' && location.pathname === '/admin') {
        return (
            <div className="min-h-screen bg-slate-50">
                <AdminDashboard
                    products={products}
                    onAddProduct={p => setProducts([...products, p])}
                    onDeleteProduct={handleDeleteProduct}
                    onEditProduct={handleEditProduct}
                    orders={orders}
                    onUpdateOrder={handleUpdateOrder}
                />
            </div>
        );
    }

    const isDarkHeroPage = ['/', '/about', '/services'].includes(location.pathname);
    const isHome = location.pathname === '/' || location.pathname === '/admin';

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${isNavScrolled ? 'glass-effect shadow-md py-3' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg font-bold transition-all ${!isNavScrolled && isDarkHeroPage ? 'bg-white text-slate-900' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}>L</div>
                        <h1 className={`text-xl font-bold font-serif tracking-[0.3em] transition-colors relative ${!isNavScrolled && isDarkHeroPage ? 'text-white' : 'text-slate-900'}`}>
                            LUXIMA<span className="text-indigo-500">.</span>
                        </h1>
                    </Link>

                    <div className={`hidden lg:flex items-center gap-10 font-medium text-[11px] uppercase tracking-[0.2em] transition-colors ${!isNavScrolled && isDarkHeroPage ? 'text-white/80' : 'text-slate-600'}`}>
                        <Link to="/services" className={`hover:text-slate-900 transition-colors relative group ${!isNavScrolled && isDarkHeroPage ? 'hover:text-white' : 'hover:text-slate-900'}`}>Services</Link>
                        <Link to="/shop" className={`hover:text-slate-900 transition-colors relative group ${!isNavScrolled && isDarkHeroPage ? 'hover:text-white' : 'hover:text-slate-900'}`}>Shop</Link>
                        <Link to="/about" className={`hover:text-slate-900 transition-colors relative group ${!isNavScrolled && isDarkHeroPage ? 'hover:text-white' : 'hover:text-slate-900'}`}>About</Link>
                        <Link to="/blog" className={`hover:text-slate-900 transition-colors relative group ${!isNavScrolled && isDarkHeroPage ? 'hover:text-white' : 'hover:text-slate-900'}`}>Blog</Link>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-5">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-full transition-colors ${!isNavScrolled && isDarkHeroPage ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <Link to="/contact" className={`hidden xl:block px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${!isNavScrolled && isDarkHeroPage ? 'border-white text-white hover:bg-white hover:text-slate-900' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                            Contact
                        </Link>
                        <div className={`relative group hidden md:block`}>
                            <input
                                type="text"
                                placeholder="Search catalog..."
                                className={`rounded-full py-2 px-4 pl-10 text-xs focus:outline-none focus:ring-1 w-40 group-hover:w-56 transition-all duration-500 ${!isNavScrolled && isDarkHeroPage ? 'bg-white/10 text-white placeholder-white/50 border border-white/20' : 'bg-slate-100/50 text-slate-900 placeholder-slate-400 border border-transparent'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${!isNavScrolled && isDarkHeroPage ? 'text-white/50' : 'text-slate-400'}`} />
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => !user && setIsAuthModalOpen(true)}
                                className={`flex items-center gap-2 p-2 rounded-full transition-colors ${!isNavScrolled && isDarkHeroPage ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                            >
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold border border-white/20">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    </div>
                                ) : (
                                    <UserIcon className="w-5 h-5" />
                                )}
                            </button>

                            {user && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/profile" className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"><UserIcon className="w-3.5 h-3.5" /> My Account</Link>
                                    <button onClick={() => setUser(null)} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-rose-500 border-t border-slate-50 mt-1 pt-2"><LogOut className="w-3.5 h-3.5" /> Logout</button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setIsWishlistOpen(true)} className={`relative p-2 rounded-full transition-colors ${!isNavScrolled && isDarkHeroPage ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
                            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>

                        <button onClick={() => setIsCartOpen(true)} className={`relative p-2 rounded-full transition-colors ${!isNavScrolled && isDarkHeroPage ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
                            <ShoppingBag className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`absolute inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col p-8`}>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-serif text-lg font-bold">L</div>
                            <span className="text-xl font-bold font-serif tracking-[0.2em] text-slate-900">LUXIMA</span>
                        </div>

                        <div className="space-y-6 flex-1">
                            {['services', 'shop', 'about', 'blog', 'contact'].map(link => (
                                <Link
                                    key={link}
                                    to={`/${link}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-2xl font-serif text-slate-900 hover:text-indigo-600 transition-colors capitalize"
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            {user ? (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{user.name[0]}</div>
                                    <div className="flex-1">
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-slate-900 block">{user.name}</Link>
                                        <button onClick={() => { setUser(null); setIsMobileMenuOpen(false); navigate('/'); }} className="text-xs text-rose-500 font-bold">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mb-6">Login / Sign Up</button>
                            )}
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">&copy; 2026 LUXIMA Interiors</p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Switcher */}
            <main className="min-h-screen">
                <Routes>
                    <Route path="/" element={
                        <HomePage
                            products={products}
                            filteredProducts={filteredProducts}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                            onViewProduct={(p) => navigate(`/product/${p.id}`)}
                        />
                    } />
                    <Route path="/admin" element={
                        <HomePage
                            products={products}
                            filteredProducts={filteredProducts}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                            onViewProduct={(p) => navigate(`/product/${p.id}`)}
                        />
                    } />
                    <Route path="/shop" element={
                        <CollectionsPage
                            products={filteredProducts}
                            onViewProduct={(p) => navigate(`/product/${p.id}`)}
                        />
                    } />
                    <Route path="/new-arrivals" element={
                        <NewArrivalsPage
                            products={filteredProducts.slice(0, 10)}
                            onViewProduct={(p) => navigate(`/product/${p.id}`)}
                        />
                    } />
                    <Route path="/product/:id" element={
                        <ProductDetailPage
                            products={products}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                        />
                    } />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/our-craft" element={<OurCraftPage />} />
                    <Route path="/profile" element={
                        <ProfilePage
                            user={user}
                            orders={orders}
                            onLogout={() => { setUser(null); navigate('/'); }}
                        />
                    } />
                    <Route path="/admin" element={
                        <AdminDashboard
                            products={products}
                            onAddProduct={(p) => setProducts([p, ...products])}
                            onDeleteProduct={handleDeleteProduct}
                            onEditProduct={handleEditProduct}
                            orders={orders}
                            onUpdateOrder={handleUpdateOrder}
                        />
                    } />
                </Routes>
            </main>

            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={setUser}
                allowSignup={location.pathname !== '/admin'}
            />

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={cartTotal}
                onPaymentSuccess={handlePaymentSuccess}
            />

            {/* Sidebars */}
            {
                isCartOpen && (
                    <div className="fixed inset-0 z-[100] overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                        <div className="absolute inset-y-0 right-0 w-screen max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                            <div className="p-8 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-serif">Your Bag</h2>
                                <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-serif text-lg">{item.name}</h4>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-2">₹{item.price.toLocaleString()}</p>
                                            <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-full text-xs">
                                                <button onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></button>
                                                <span className="font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {cart.length === 0 && <p className="text-center text-slate-400 italic pt-12">Your shopping bag is empty.</p>}
                            </div>
                            {cart.length > 0 && (
                                <div className="p-8 border-t bg-slate-50">
                                    <div className="flex justify-between font-serif text-xl mb-6"><span>Total</span><span>₹{cartTotal.toLocaleString()}</span></div>
                                    <button onClick={handleCheckout} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold hover:bg-slate-800 transition-all">Proceed to Checkout</button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Wishlist Sidebar */}
            {
                isWishlistOpen && (
                    <div className="fixed inset-0 z-[100] overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)}></div>
                        <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                                <h2 className="text-2xl font-serif flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Wishlist
                                </h2>
                                <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {wishlist.map(item => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                            <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                                            <button
                                                onClick={() => toggleWishlist(item)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm text-rose-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-serif text-lg mb-1">{item.name}</h4>
                                            <p className="text-sm font-bold text-slate-900 mb-4">₹{item.price.toLocaleString()}</p>
                                            <button
                                                onClick={() => { addToCart(item); toggleWishlist(item); }}
                                                className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 border-b border-indigo-100 pb-1 flex items-center gap-2"
                                            >
                                                Move to Cart <ShoppingBag size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {wishlist.length === 0 && (
                                    <div className="text-center py-20 flex flex-col items-center">
                                        <Heart className="w-12 h-12 text-slate-100 mb-6" strokeWidth={1} />
                                        <p className="text-slate-400 italic">No items saved to wishlist yet.</p>
                                        <button onClick={() => { setIsWishlistOpen(false); navigate('/shop'); }} className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1">Start Exploring</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default App;
