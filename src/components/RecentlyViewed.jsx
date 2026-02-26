import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const RecentlyViewed = ({ products }) => {
    const [recentIds, setRecentIds] = React.useState([]);

    React.useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentIds(stored);
    }, []);

    const recentProducts = recentIds
        .map(id => products.find(p => p.id.toString() === id.toString()))
        .filter(Boolean)
        .slice(0, 4);

    if (recentProducts.length === 0) return null;

    return (
        <section className="py-24 border-t border-slate-50 bg-slate-50/30">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-1">Your Journey</p>
                        <h3 className="text-3xl font-serif text-slate-900">Recently Viewed.</h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {recentProducts.map(rp => (
                        <Link
                            to={`/product/${rp.id}`}
                            key={rp.id}
                            className="group cursor-pointer space-y-5"
                        >
                            <div className="aspect-[4/5] bg-white rounded-[2rem] overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-700">
                                <img
                                    src={rp.image}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                    alt={rp.name}
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-500"></div>
                            </div>
                            <div className="px-2">
                                <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold mb-1">{rp.category}</p>
                                <h4 className="font-serif text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{rp.name}</h4>
                                <p className="text-xs font-bold text-slate-900">₹{rp.price.toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;
