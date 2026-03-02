import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const WishlistPage = ({ wishlist, toggleWishlist, addToCart, onViewProduct }) => {
    const navigate = useNavigate();

    const handleMoveToCart = (product) => {
        addToCart(product);
        toggleWishlist(product);
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-24 flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <Heart className="text-slate-200" size={48} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-serif text-slate-900 mb-4">Your wishlist is empty.</h2>
                <p className="text-slate-400 mb-8 max-w-sm text-center">
                    Save your favorite pieces to revisit them later. Start exploring our collections.
                </p>
                <Link 
                    to="/shop" 
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-3"
                >
                    Explore Collections <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-bold mb-2">Saved Items</p>
                        <h1 className="text-4xl font-serif text-slate-900">My Wishlist</h1>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div 
                            key={item.id} 
                            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col"
                        >
                            {/* Image */}
                            <div 
                                className="relative aspect-[4/3] overflow-hidden bg-slate-50 cursor-pointer"
                                onClick={() => onViewProduct(item)}
                            >
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={item.name}
                                    onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(item);
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div 
                                    className="cursor-pointer mb-2"
                                    onClick={() => onViewProduct(item)}
                                >
                                    <h3 className="font-serif text-lg font-bold text-slate-900 truncate hover:text-indigo-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div>
                                        <p className="text-xl font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                                    >
                                        <ShoppingBag size={14} />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State Hint */}
                {wishlist.length > 0 && (
                    <div className="mt-16 text-center">
                        <p className="text-xs text-slate-400 mb-6">
                            Or continue browsing to add more to your collection
                        </p>
                        <Link 
                            to="/shop" 
                            className="inline-flex items-center gap-3 px-8 py-4 border border-slate-200 text-slate-900 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-slate-900 hover:text-white transition-all"
                        >
                            Browse More <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
