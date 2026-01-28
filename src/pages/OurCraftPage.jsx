import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const OurCraftPage = () => (
    <div className="pt-32 pb-24 animate-in fade-in duration-700">
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-serif mb-8">The Art of Making</h2>
                <p className="text-xl text-slate-500 font-light leading-relaxed">We believe that true luxury lies in the time, patience, and skill dedicated to creating each piece. Our furniture is not manufactured; it is crafted.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
            <img
                src="https://images.unsplash.com/photo-1617103173699-2a91f4a43477?q=80&w=2000"
                className="w-full h-[600px] object-cover"
                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
            />
            <div className="bg-slate-900 text-white p-16 md:p-24 flex flex-col justify-center">
                <h3 className="text-3xl font-serif mb-6">Sustainable Materials</h3>
                <p className="text-slate-400 leading-relaxed mb-8">We source our woods from certified sustainable forests in Northern Europe and North America. Every tree harvested is replaced, ensuring the longevity of our natural resources.</p>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-2xl font-serif mb-2">100%</h4>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Eco-Certified</p>
                    </div>
                    <div>
                        <h4 className="text-2xl font-serif mb-2">0%</h4>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Toxic Finishes</p>
                    </div>
                </div>
            </div>
            <div className="bg-stone-100 p-16 md:p-24 flex flex-col justify-center order-last md:order-none">
                <h3 className="text-3xl font-serif mb-6 text-slate-900">Master Artisans</h3>
                <p className="text-slate-600 leading-relaxed mb-8">Our workshops are home to third-generation craftsmen who have dedicated their lives to mastering traditional joinery and upholstery techniques.</p>
                <button className="self-start px-8 py-3 border border-slate-900 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Meet things Team</button>
            </div>
            <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000"
                className="w-full h-[600px] object-cover"
                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
            />
        </div>
    </div>
);

export default OurCraftPage;
