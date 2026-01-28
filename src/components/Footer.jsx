import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-24 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="md:col-span-1">
                        <Link to="/" className="inline-block">
                            <h2 className="text-2xl font-serif font-bold mb-8">LUXIMA<span className="text-indigo-500">.</span></h2>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Curating exceptional spaces with timeless furniture and bespoke design.
                            Crafted for those who seek elegance in every detail.
                        </p>
                        <div className="flex gap-4">
                            {['Instagram', 'Pinterest', 'LinkedIn'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Collections</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/shop" className="hover:text-white transition-colors">Living Room</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Dining & Kitchen</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Bedroom Sanctuary</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Outdoor Living</Link></li>
                            <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">Design Studio</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Client Services</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Care Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><Link to="/services" className="hover:text-white transition-colors">Interior Design Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
                    <p>&copy; 2026 LuxeHomé Interiors. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
