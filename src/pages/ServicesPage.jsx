import React from 'react';
import { Ruler, Pencil, Drill, ArrowRight, ShieldCheck, Truck, RotateCcw, Paintbrush } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const ServicesPage = () => {
    const services = [
        {
            title: 'Interior Curation',
            desc: 'We go beyond decoration to create intimate, architectural environments that reflect your specific psychological and lifestyle needs.',
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
            icon: Paintbrush
        },
        {
            title: 'Spatial Planning',
            desc: 'Optimizing the flow of light and movement. Our spatial audits ensure your environment breathe and evolves with you over decades.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
            icon: Ruler
        },
        {
            title: 'Bespoke Fabrication',
            desc: 'For the truly unique. Our master craftsmen build one-of-a-kind pieces that are tailored to your space down to the last millimeter.',
            image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800',
            icon: Pencil
        }
    ];

    return (
        <div className="bg-white">
            {/* Header */}
            <section className="pt-40 pb-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 font-bold mb-6">Our Expertise</p>
                    <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight">Mastery in every <br /> <span className="italic text-slate-400">Interaction.</span></h1>
                    <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                        From initial spatial analysis to the final placement of a hand-woven textile, our services are designed to remove the friction between dream and reality.
                    </p>
                </div>
            </section>

            {/* Main Services */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                        {services.map((s, i) => (
                            <div key={i} className="group cursor-default flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                    <s.icon size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif mb-6 text-slate-900 uppercase tracking-tighter">{s.title}</h3>
                                <p className="text-slate-500 font-light leading-relaxed mb-10 text-sm">
                                    {s.desc}
                                </p>
                                <div className="w-full h-64 overflow-hidden rounded-2xl mb-10 grayscale hover:grayscale-0 transition-all duration-1000">
                                    <img
                                        src={s.image}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                        alt={s.title}
                                        onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                                    />
                                </div>
                                <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-slate-900 pb-1 hover:gap-5 transition-all">
                                    Consult our designers <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantees */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { t: 'Lifetime Warranty', d: 'Every weld and stitch guaranteed for life.', i: ShieldCheck },
                            { t: 'White Glove Delivery', d: 'Zero-touch installation in your space.', i: Truck },
                            { t: 'Sourcing Registry', d: 'Authenticity certificate for every material.', i: Drill },
                            { t: 'Care Consultations', d: 'Monthly guides for piece preservation.', i: RotateCcw }
                        ].map((g, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="text-slate-900 pt-1"><g.i size={24} strokeWidth={1.5} /></div>
                                <div>
                                    <h4 className="font-serif text-xl mb-2 text-slate-900">{g.t}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-light">{g.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Callout */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-32 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                            />
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-tight">Ready to transcend the <br /><span className="italic text-slate-400">ordinary?</span></h2>
                            <p className="text-xl text-slate-400 font-light mb-12 leading-relaxed">
                                Our studio is currently accepting a limited number of new residential projects. Let us help you craft your legacy.
                            </p>
                            <button className="bg-white text-slate-900 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                Book a Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
