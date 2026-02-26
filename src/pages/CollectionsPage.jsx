import React, { useState } from 'react';
import { Filter, X, ShoppingCart, Star, ChevronDown, Heart, Search } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const CollectionsPage = ({ products, onViewProduct }) => {
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Categories derived from products
    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredAndSortedProducts = products
        .filter(product => {
            // Price Filter
            const min = priceRange.min ? Number(priceRange.min) : 0;
            const max = priceRange.max ? Number(priceRange.max) : Infinity;
            const matchesPrice = product.price >= min && product.price <= max;

            // Category Filter
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

            return matchesPrice && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'newest') return b.id - a.id; // Assuming higher ID is newer
            return 0;
        });

    return (
        <div className="pt-32 pb-24 container mx-auto px-6 animate-in fade-in duration-700 min-h-screen">
            <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Our Complete Catalog</p>
                <h2 className="text-4xl md:text-5xl font-serif mb-4 text-slate-900">The Collections</h2>
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
                <aside className={`lg:w-1/5 space-y-8 h-fit transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                    {/* Category Filter */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Categories</h3>
                        <div className="flex flex-col gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`text-left text-sm py-2 px-4 rounded-lg transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Price Range</h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button
                            onClick={() => { setPriceRange({ min: '', max: '' }); setSelectedCategory('All'); }}
                            className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            Reset Defaults
                        </button>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-xs font-medium text-slate-400">Viewing <span className="font-bold text-slate-900">{filteredAndSortedProducts.length}</span> Masterpieces</p>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Sort By</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-slate-50 text-xs font-bold text-slate-900 px-4 py-2 rounded-xl outline-none border border-transparent focus:border-slate-200 transition-all cursor-pointer"
                            >
                                <option value="newest">New Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product) => {
                                const discount = (product.id % 3 === 0) ? 10 : null;
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
