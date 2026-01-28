import React from 'react';
import { FALLBACK_IMAGE } from '../constants';

const NewArrivalsPage = ({ products, onViewProduct }) => (
    <div className="pt-32 pb-24 container mx-auto px-6 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-100 pb-12">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-bold mb-4">Just Arrived</p>
                <h2 className="text-5xl font-serif">New Season</h2>
            </div>
            <p className="max-w-md text-slate-500 italic">Be the first to experience our latest masterpieces, fresh from our artisan workshops in Milan and Kyoto.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.slice(0, 4).map((product, idx) => (
                <div key={product.id} className={`group cursor-pointer ${idx % 2 === 1 ? 'md:mt-24' : ''}`} onClick={() => onViewProduct(product)}>
                    <div className="aspect-square overflow-hidden rounded-full bg-slate-50 mb-8 relative">
                        <img
                            src={product.image}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                            alt={product.name}
                        />
                        <div className="absolute top-0 right-0 p-4 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full m-4">New</div>
                    </div>
                    <div className="text-center">
                        <h4 className="font-serif text-2xl mb-2">{product.name}</h4>
                        <p className="text-slate-500">₹{product.price.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default NewArrivalsPage;
