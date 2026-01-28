import React, { useState } from 'react';
import { Filter, X, ShoppingCart, Star, ChevronDown, Heart, Search } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const CollectionsPage = ({ products, onViewProduct }) => {
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [activeFilter, setActiveFilter] = useState(null);

    // Mock discount for display purposes (random off for demo styling)
    const getDiscount = (id) => (id % 2 === 0 ? 15 : null);

    const filteredProducts = products.filter(product => {
        // Price Range Filter
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        const matchesPrice = product.price >= min && product.price <= max;

        // Quick Filter Tags
        let matchesTag = true;
        if (activeFilter === 'Under ₹40,000') matchesTag = product.price < 40000;
        if (activeFilter === '₹40,000 - ₹80,000') matchesTag = product.price >= 40000 && product.price <= 80000;
        if (activeFilter === '₹80,000+') matchesTag = product.price > 80000;

        return matchesPrice && matchesTag;
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="pt-32 pb-24 container mx-auto px-6 animate-in fade-in duration-700 min-h-screen">
            <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Our Complete Catalog</p>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-slate-900">The Collections</h2>
                <div className="w-24 h-[1px] bg-slate-900 mx-auto"></div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-8">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    <Filter className="w-4 h-4" /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className={`lg:w-1/4 space-y-8 h-fit transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                    {/* Price Filter Box */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <Filter className="w-5 h-5 fill-slate-900" />
                            <h3 className="font-bold text-lg font-serif">Filter</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Price Range</label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                Apply Filter
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => { setPriceRange({ min: '', max: '' }); setActiveFilter(null); }}
                                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                <X className="w-3 h-3" /> Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <h3 className="font-bold text-lg font-serif">Quick Filters</h3>
                        </div>
                        <div className="space-y-3">
                            {['Under ₹40,000', '₹40,000 - ₹80,000', '₹80,000+'].map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveFilter(label); setPriceRange({ min: '', max: '' }); }}
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all border ${activeFilter === label
                                        ? 'bg-white border-slate-900 text-slate-900 shadow-md'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> products</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">Sort By:</span>
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                                    Newest <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                const discount = getDiscount(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-1"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onViewProduct(product)}>
                                            <img
                                                src={product.image}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                alt={product.name}
                                                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                            />

                                            {discount && (
                                                <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                                    {discount}% OFF
                                                </span>
                                            )}

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="mb-2">
                                                <h4 className="font-serif text-lg font-bold text-slate-900 truncate cursor-pointer hover:text-indigo-900 transition-all" onClick={() => onViewProduct(product)}>{product.name}</h4>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-bold">({Math.floor(Math.random() * 200)} reviews)</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-6">
                                                {product.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div>
                                                    {discount && (
                                                        <p className="text-xs text-slate-400 line-through font-medium">₹{Math.round(product.price * 1.15).toLocaleString()}</p>
                                                    )}
                                                    <p className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                        title="Add to Wishlist"
                                                    >
                                                        <Heart className="w-4 h-4 fill-current" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <Search className="w-12 h-12 text-slate-200 mx-auto mb-6" strokeWidth={1} />
                                <h3 className="text-2xl font-serif text-slate-900 mb-2">No items found</h3>
                                <p className="text-slate-400 font-light">Try adjusting your search query or price filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
