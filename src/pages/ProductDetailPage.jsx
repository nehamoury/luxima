import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Heart,
    ShoppingBag,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ArrowLeft,
    Plus,
    Minus,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { api } from '../api';
import { FALLBACK_IMAGE } from '../constants';

const ProductDetailPage = ({ products, addToCart, toggleWishlist, wishlist }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find(p => p.id.toString() === id.toString());
            setProduct(found);
            if (found) {
                setSelectedImage(found.image);
                fetchReviews(found.id);

                // Track recently viewed
                const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const updated = [id, ...recent.filter(item => item.toString() !== id.toString())].slice(0, 10);
                localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            }
        }
        window.scrollTo(0, 0);
    }, [id, products]);

    const fetchReviews = async (productId) => {
        try {
            const data = await api.getReviews(productId);
            setReviews(data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.addReview({
                product_id: product.id,
                customer_name: newReview.name || 'Anonymous User',
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '', name: '' });
            setShowReviewForm(false);
            fetchReviews(product.id);
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product, products]);

    if (!product) {
        return (
            <div className="min-h-screen pt-40 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-8"></div>
                <p className="text-slate-400 font-serif italic text-xl">Arriving at your selection...</p>
            </div>
        );
    }

    const handleAddToCart = () => {
        setIsAdding(true);
        // Simulate a small delay for premium feel
        setTimeout(() => {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            setIsAdding(false);
        }, 600);
    };

    return (
        <div className="bg-white selection:bg-slate-900 selection:text-white">
            <div className="pt-32 pb-24 container mx-auto px-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Modern Breadcrumbs */}
                <nav className="flex items-center gap-3 mb-16 text-[10px] uppercase tracking-[0.4em] font-bold text-slate-300">
                    <Link to="/" className="hover:text-slate-900 transition-colors">Archive</Link>
                    <ChevronRight size={10} className="text-slate-200" />
                    <Link to="/shop" className="hover:text-slate-900 transition-colors uppercase">{product.category}</Link>
                    <ChevronRight size={10} className="text-slate-200" />
                    <span className="text-slate-900 italic font-serif normal-case text-xs tracking-normal">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-32">
                    {/* Immersive Image Gallery */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-slate-200/50">
                            <img
                                src={selectedImage}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                alt={product.name}
                                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-8 right-8 p-5 backdrop-blur-md rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${wishlist.some(i => i.id === product.id) ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white/90 text-slate-400 hover:text-rose-500'}`}
                            >
                                <Heart className={`w-6 h-6 ${wishlist.some(i => i.id === product.id) ? 'fill-current' : ''}`} />
                            </button>

                            {/* Floating Badge */}
                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl border border-white/20">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Limited Edition Piece</span>
                            </div>
                        </div>

                        {/* Aesthetic Thumbnails */}
                        <div className="grid grid-cols-4 gap-6 px-4">
                            {[product.image, ...Array(3).fill(product.image)].map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 relative group ${selectedImage === img && i === 0 ? 'ring-2 ring-slate-900 scale-95 shadow-lg' : 'opacity-40 hover:opacity-100 uppercase'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="thumbnail" onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Premium Product Info */}
                    <div className="lg:col-span-6 flex flex-col pt-4">
                        <div className="mb-12">
                            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-bold text-indigo-600 mb-6 bg-indigo-50 px-4 py-1 rounded-full">
                                {product.category}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif mb-8 text-slate-900 leading-[1.1] tracking-tighter">
                                {product.name}
                            </h2>

                            <div className="flex items-center gap-8 mb-10">
                                <p className="text-4xl font-light text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</p>
                                <div className="h-10 w-[1px] bg-slate-200"></div>
                                <div className="space-y-1">
                                    <div className="flex text-amber-500 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={`${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{product.rating} / 5.0 Rating</p>
                                </div>
                            </div>

                            <p className="text-lg text-slate-500 font-light leading-relaxed mb-12 border-l-2 border-slate-100 pl-8">
                                {product.description || "An architectural masterpiece designed to transcend trends. This piece balances structural integrity with ethereal aesthetics, hand-finished to a standard usually reserved for the galleries of Milan."}
                            </p>
                        </div>

                        {/* Interactive Options */}
                        <div className="space-y-12 mb-16">
                            <div className="space-y-6">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-900 flex justify-between">
                                    <span>Select Luminaire Finish</span>
                                    <span className="text-slate-400">Natural Ash</span>
                                </label>
                                <div className="flex gap-4">
                                    {['Natural Ash', 'Night Obsidian', 'Polished Steel'].map(finish => (
                                        <button
                                            key={finish}
                                            className={`flex-1 py-4 border text-[10px] uppercase tracking-widest font-bold rounded-2xl transition-all duration-300 ${finish === 'Natural Ash' ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200' : 'border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'}`}
                                        >
                                            {finish}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex flex-col gap-4 flex-1">
                                    <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-900">Quantity</label>
                                    <div className="flex items-center justify-between gap-6 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white transition-colors text-slate-400 hover:text-slate-900"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-serif text-xl font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white transition-colors text-slate-400 hover:text-slate-900"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Primary CTAs */}
                        <div className="flex flex-col gap-4 mb-16">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`group relative w-full bg-slate-900 text-white py-7 rounded-[2rem] font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 active:scale-[0.98] overflow-hidden ${isAdding ? 'opacity-80' : 'hover:bg-indigo-600 shadow-2xl shadow-indigo-100'}`}
                            >
                                <span className={`transition-all duration-500 ${isAdding ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                                    Add to Collection
                                </span>
                                <ShoppingBag className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isAdding ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />

                                {isAdding && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Detailed Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12 border-t border-slate-100">
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group">
                                    <Truck size={20} strokeWidth={1.5} className="group-hover:text-slate-900 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-900 mb-1">Global Concierge</p>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Insured white-glove <br /> delivery globally.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group">
                                    <Shield size={20} strokeWidth={1.5} className="group-hover:text-slate-900 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-900 mb-1">Lifetime Promise</p>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Certified architectural <br /> structural warranty.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group">
                                    <RotateCcw size={20} strokeWidth={1.5} className="group-hover:text-slate-900 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-900 mb-1">Seamless Return</p>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">30-day effortless <br /> exchange program.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editorial Details Section */}
                <section className="py-32 border-t border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        <div className="lg:col-span-4 space-y-12">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-6">Mastery & Form</p>
                                <h3 className="text-4xl font-serif mb-8 text-slate-900">Technical <br /> Specifications.</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-light italic">"Every millimeter is accounted for, every texture purposeful."</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { l: 'Dimensions', v: 'H 85cm x W 220cm x D 95cm' },
                                    { l: 'Materiality', v: 'Sustainable European Ash / Solid Brass' },
                                    { l: 'Weight', v: '62.5 kg' },
                                    { l: 'Masterisan', v: 'Giovanni Rossi Studio, Milan' },
                                    { l: 'Certificates', v: 'FSC-Certified, REACH Compliant' }
                                ].map(spec => (
                                    <div key={spec.l} className="flex justify-between py-4 border-b border-slate-50 group hover:border-slate-200 transition-colors">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{spec.l}</span>
                                        <span className="text-xs font-medium text-slate-900">{spec.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col">
                            <div className="flex justify-between items-end mb-16 px-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Atmosphere Feedback</p>
                                    <h3 className="text-4xl font-serif text-slate-900">Patron Reviews.</h3>
                                </div>
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 border-b border-indigo-100 pb-1 hover:text-indigo-400 transition-colors"
                                >
                                    {showReviewForm ? 'Cancel' : 'Write Review'}
                                </button>
                            </div>

                            {showReviewForm && (
                                <form onSubmit={handleReviewSubmit} className="mb-16 p-8 bg-slate-50 rounded-[2rem] space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newReview.name}
                                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Rating</label>
                                            <div className="flex gap-2 h-full items-center">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                        className={`transition-colors ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-200'}`}
                                                    >
                                                        <Star size={24} className={star <= newReview.rating ? 'fill-current' : ''} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Your Experience</label>
                                        <textarea
                                            required
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                            placeholder="Share your thoughts on this aesthetic piece..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-[0.98]"
                                    >
                                        Publish Review
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {reviews.length > 0 ? reviews.map((rev, i) => (
                                    <div key={rev.id || i} className="p-10 bg-slate-50 rounded-[2.5rem] space-y-8 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-700">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                            <MessageSquare size={60} />
                                        </div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm text-slate-900">{rev.customer_name}</p>
                                                <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                                    <Calendar size={10} /> {new Date(rev.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex text-amber-400 gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < rev.rating ? 'fill-current' : 'text-slate-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm font-light text-slate-600 leading-relaxed italic relative z-10 font-serif">"{rev.comment}"</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                        <p className="text-slate-400 italic">No feedback yet. Be the first to share your experience.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recommended Section */}
                <section className="py-32 border-t border-slate-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-4">
                        <div className="max-w-xl">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-6">Recommended Aesthetics</p>
                            <h3 className="text-4xl font-serif text-slate-900 leading-tight">Complete the <br /> Atmosphere.</h3>
                        </div>
                        <Link to="/shop" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-900">
                            See All Pieces <ArrowLeft className="rotate-180 group-hover:translate-x-2 transition-transform" size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map(rp => (
                                <Link
                                    to={`/product/${rp.id}`}
                                    key={rp.id}
                                    className="group cursor-pointer space-y-6"
                                >
                                    <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden relative shadow-sm hover:shadow-2xl transition-all duration-700">
                                        <img
                                            src={rp.image}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                            alt={rp.name}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-500"></div>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">{rp.category}</p>
                                        <h4 className="font-serif text-xl text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{rp.name}</h4>
                                        <p className="text-sm font-bold text-slate-900">₹{rp.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 italic">Curating more pieces for this collection...</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Back to Archives */}
                <div className="pt-24 border-t border-slate-100 text-center">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold text-slate-400 hover:text-slate-900 transition-all group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Archives
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
