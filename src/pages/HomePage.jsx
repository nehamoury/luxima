import React, { useRef } from 'react';
import { Quote, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import RecentlyViewed from '../components/RecentlyViewed';
import { FALLBACK_IMAGE, CATEGORIES, TESTIMONIALS } from '../constants';

const HomePage = ({
    products,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    toggleWishlist,
    wishlist,
    onViewProduct
}) => {
    const trendingRef = useRef(null);

    const scrollTrending = (dir) => {
        if (trendingRef.current) {
            const scrollAmt = 300;
            trendingRef.current.scrollBy({ left: dir === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
        }
    };

    return (
        <>
            <HeroCarousel />
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Quote className="w-12 h-12 text-slate-100 mx-auto mb-10" />
                    <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-8">
                        "Design is not just what it looks like and feels like. Design is how it works."
                    </h3>
                    <div className="w-24 h-[1px] bg-slate-900 mx-auto mb-8"></div>
                    <p className="text-slate-400 text-sm uppercase tracking-[0.3em] font-bold">Our Design Philosophy</p>
                </div>
            </section>

            <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-6 flex justify-center gap-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all whitespace-nowrap pb-1 border-b-2 ${selectedCategory === cat
                                ? 'border-slate-900 text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Curated Selection</p>
                            <h3 className="text-4xl font-serif">Featured Pieces</h3>
                        </div>
                        <p className="max-w-xs text-sm text-slate-500 leading-relaxed italic">Explore the pinnacle of artisanal craftsmanship.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredProducts.map((product, idx) => (
                            <div
                                key={product.id}
                                className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                style={{ animationDelay: `${idx * 150}ms` }}
                                onClick={() => onViewProduct(product)}
                            >
                                <div className="aspect-[4/5] overflow-hidden bg-slate-50 relative">
                                    <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={product.name} onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>

                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-amber-500 fill-current" /> {product.rating}
                                    </span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-rose-500 hover:scale-110"
                                    >
                                        <Heart className={`w-4 h-4 ${wishlist.some(i => i.id === product.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="mb-3">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{product.category}</p>
                                        <h4 className="font-serif text-lg font-bold text-slate-900 truncate">{product.name}</h4>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-900 font-bold">₹{product.price.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400 font-medium hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4">View Details</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Popular Right Now</p>
                            <h3 className="text-3xl font-serif">Trending Designs</h3>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => scrollTrending('left')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-900 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={() => scrollTrending('right')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-900 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div ref={trendingRef} className="flex gap-8 overflow-x-auto no-scrollbar pb-8 scroll-smooth">
                        {products.map(product => (
                            <div key={product.id} className="min-w-[280px] group cursor-pointer" onClick={() => onViewProduct(product)}>
                                <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 relative shadow-sm">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                                    <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Star className="w-2 h-2 text-amber-500 fill-current" /> {product.rating}
                                    </div>
                                </div>
                                <h4 className="font-serif text-lg truncate">{product.name}</h4>
                                <p className="text-sm text-slate-400 font-medium">₹{product.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center mb-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Patron Stories</p>
                    <h3 className="text-4xl font-serif">What Our Patrons Say</h3>
                </div>
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {TESTIMONIALS.map(t => (
                        <div key={t.id} className="p-10 bg-slate-50 rounded-3xl relative">
                            <div className="flex gap-1 text-amber-500 mb-6">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
                            <div>
                                <h5 className="font-serif text-lg">{t.name}</h5>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <RecentlyViewed products={products} />
        </>
    );
};

export default HomePage;
