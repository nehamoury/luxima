import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_SLIDES, FALLBACK_IMAGE } from '../constants';

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="relative h-screen flex items-center overflow-hidden bg-slate-900">
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Background Image with Zoom */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={slide.image}
                            className={`w-full h-full object-cover transition-transform ease-out ${index === current ? 'scale-110' : 'scale-100'}`}
                            style={{ transitionDuration: '10000ms' }}
                            alt={slide.subtitle}
                            onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center items-center text-center text-white">
                        <div className="max-w-4xl mx-auto flex flex-col items-center">
                            {/* Main Heading */}
                            <h2
                                className={`text-4xl sm:text-7xl lg:text-9xl font-serif mb-6 md:mb-8 leading-[1.1] transition-all duration-700 delay-300 ease-out transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                                style={{ wordSpacing: '0.1em' }}
                            >
                                {slide.title}
                            </h2>

                            {/* Description */}
                            <p className={`text-lg md:text-xl font-light text-slate-300 max-w-2xl mb-12 leading-relaxed transition-all duration-700 delay-500 ease-out transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                                {slide.description}
                            </p>

                            {/* CTA */}
                            <div className={`flex flex-col sm:flex-row items-center justify-center gap-8 transition-all duration-700 delay-700 ease-out transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                                <button className="group relative overflow-hidden bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-xl">
                                    <span className="relative z-10 flex items-center gap-3">
                                        {slide.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>

                                <div className="hidden sm:flex items-center gap-4 text-white/40 group cursor-pointer">
                                    <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-white/40 transition-all"></div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover More</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Custom Navigation Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
                {HERO_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="group py-4 px-2"
                    >
                        <div className={`h-[2px] transition-all duration-500 rounded-full ${i === current ? 'w-12 bg-white' : 'w-6 bg-white/20 group-hover:bg-white/40'}`} />
                    </button>
                ))}
            </div>

            {/* Side Label */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-8 text-white/20">
                <span className="rotate-90 text-[10px] uppercase tracking-[0.5em] font-bold whitespace-nowrap">Excellence Since 1994</span>
                <div className="w-[1px] h-32 bg-white/10"></div>
                <span className="text-xl font-serif">0{current + 1}</span>
            </div>
        </header>
    );
};

export default HeroCarousel;
