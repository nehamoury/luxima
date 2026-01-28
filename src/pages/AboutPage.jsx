import React, { useEffect, useState } from 'react';
import {
    Award,
    Compass,
    Feather,
    ShieldCheck,
    Users,
    Clock,
    Heart,
    ArrowRight
} from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        { label: 'Exquisite Projects', val: '250+', icon: Award },
        { label: 'Design Awards', val: '24', icon: Award },
        { label: 'Years of Expertise', val: '12', icon: Clock },
        { label: 'Client Satisfaction', val: '99%', icon: Heart },
    ];

    const values = [
        {
            title: "Artisanal Integrity",
            desc: "Every piece is a testament to timeless craftsmanship and meticulous attention to detail.",
            icon: Feather
        },
        {
            title: "Sustainable Luxury",
            desc: "We prioritize ethically sourced materials without compromising on opulence.",
            icon: ShieldCheck
        },
        {
            title: "Curated Comfort",
            desc: "Design that doesn't just look beautiful, but feels like home.",
            icon: Compass
        }
    ];

    return (
        <div className="bg-white selection:bg-slate-900 selection:text-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-110 animate-slow-zoom">
                    <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
                        alt="Interior"
                        className="w-full h-full object-cover filter brightness-[0.7] grayscale-[0.2]"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <span className={`inline-block text-[10px] uppercase tracking-[0.5em] font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Our Legacy
                    </span>
                    <h1 className={`text-4xl sm:text-7xl lg:text-9xl font-serif mb-8 leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Elevating the <br /> <span className="italic text-slate-300">Modern Soul.</span>
                    </h1>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
                    <div className="w-[1px] h-12 bg-white/40"></div>
                </div>
            </section>

            {/* Our Philosophy */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">The Vision</p>
                            <h2 className="text-4xl md:text-6xl font-serif leading-tight text-slate-900">
                                Beyond the <br /> Ordinary.
                            </h2>
                            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-xl">
                                LUXEHOMÉ was born from a simple yet profound desire: to bridge the gap between architectural grandeur and daily intimacy.
                                We don't just sell furniture; we curate environments that inspire the way you live.
                            </p>
                            <div className="space-y-4 pt-4 text-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                    <p className="text-sm font-medium">Bespoke Architectural Integration</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                    <p className="text-sm font-medium">Global Artisanal Sourcing</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                    <p className="text-sm font-medium">Timeless Minimalist Aesthetic</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
                                alt="Philosophy"
                                className="w-full h-[600px] object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                                onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                            />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-32 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:-translate-y-2">
                                    <stat.icon size={20} />
                                </div>
                                <h3 className="text-5xl font-serif mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {stat.val}
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-xl">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Core Principles</p>
                            <h2 className="text-4xl md:text-5xl font-serif text-slate-900">What defines us.</h2>
                        </div>
                        <p className="text-slate-500 font-light max-w-xs italic leading-relaxed">
                            "Luxury is not about price; it is about the poetry of one's surroundings."
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {values.map((v, i) => (
                            <div key={i} className="space-y-6 group">
                                <v.icon className="w-10 h-10 text-slate-200 group-hover:text-slate-900 transition-colors duration-500" strokeWidth={1} />
                                <h4 className="text-2xl font-serif text-slate-900">{v.title}</h4>
                                <p className="text-slate-500 leading-relaxed font-light">
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team Callout */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <Users className="w-16 h-16 mb-10 text-slate-700" strokeWidth={0.5} />
                    <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight max-w-4xl">
                        A Collective of <br /> <span className="italic text-slate-400">Architects and Dreamers.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-light max-w-2xl mb-12 leading-relaxed">
                        Based in the heart of design, we operate globally to bring the world's most beautiful pieces to your doorstep. Every curator on our team shares a singular obsession: perfection.
                    </p>
                    <button className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:gap-6 transition-all duration-500">
                        Meet the curators <ArrowRight size={14} className="group-hover:text-indigo-400" />
                    </button>
                </div>
            </section>

            {/* Custom Animations */}
            <style>{`
                @keyframes slow-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.15); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
