import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, ArrowRight, Instagram, Linkedin, Twitter, Globe } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const ContactPage = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <section className="pt-40 pb-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-6">Connect with us</p>
                        <h1 className="text-5xl md:text-8xl font-serif text-slate-900 leading-tight mb-8">
                            Let's define your <br /> <span className="italic text-slate-400">Environment.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                            Whether you're starting a new project or seeking a rare piece for your collection, our curators are here to guide you through the process.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Contact Information */}
                        <div className="lg:col-span-5 space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
                                {/* Email */}
                                <div className="group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <Mail size={18} strokeWidth={1.5} />
                                        </div>
                                        <h4 className="font-serif text-xl">Inquiries</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2 font-light">Direct all general and press inquiries to:</p>
                                    <a href="mailto:hello@luxehome.com" className="text-lg font-medium border-b border-slate-200 hover:border-slate-900 transition-all">hello@luxehome.com</a>
                                </div>

                                {/* Phone */}
                                <div className="group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <Phone size={18} strokeWidth={1.5} />
                                        </div>
                                        <h4 className="font-serif text-xl">Private Concierge</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2 font-light">Available Mon-Fri, 9am - 6pm EST:</p>
                                    <a href="tel:+1234567890" className="text-lg font-medium border-b border-slate-200 hover:border-slate-900 transition-all">+1 (234) 567-890</a>
                                </div>

                                {/* Studio */}
                                <div className="group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <MapPin size={18} strokeWidth={1.5} />
                                        </div>
                                        <h4 className="font-serif text-xl">The Studio</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2 font-light">Visit our flagship design district gallery:</p>
                                    <p className="text-lg font-medium leading-relaxed">
                                        123 Design District, Manhattan<br />
                                        New York, NY 10013
                                    </p>
                                </div>
                            </div>

                            {/* Social Presence */}
                            <div className="pt-8 border-t border-slate-100">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-8">Digital Presence</p>
                                <div className="flex gap-4">
                                    {[
                                        { i: Instagram, l: 'Instagram' },
                                        { i: Linkedin, l: 'LinkedIn' },
                                        { i: Twitter, l: 'Twitter' },
                                        { i: Globe, l: 'Behance' }
                                    ].map((social, i) => (
                                        <a key={i} href="#" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                                            <social.i size={18} strokeWidth={1.5} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-10 text-indigo-400">
                                        <MessageSquare size={20} />
                                        <span className="text-xs uppercase tracking-[0.3em] font-bold">Start a Conversation</span>
                                    </div>

                                    <form className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white/5 border-b border-white/10 p-4 font-light focus:outline-none focus:border-white transition-all text-white placeholder-white/20"
                                                    placeholder="e.g. Alexander Pierce"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="w-full bg-white/5 border-b border-white/10 p-4 font-light focus:outline-none focus:border-white transition-all text-white placeholder-white/20"
                                                    placeholder="e.g. alex@studio.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Subject of Inquiry</label>
                                            <select className="w-full bg-white/5 border-b border-white/10 p-4 font-light focus:outline-none focus:border-white transition-all text-white/60 appearance-none cursor-pointer">
                                                <option className="bg-slate-800">Interior Design Project</option>
                                                <option className="bg-slate-800">Bespoke Furniture Inquiry</option>
                                                <option className="bg-slate-800">Partnership & Media</option>
                                                <option className="bg-slate-800">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Your Vision</label>
                                            <textarea
                                                className="w-full h-40 bg-white/5 border-b border-white/10 p-4 font-light focus:outline-none focus:border-white transition-all text-white placeholder-white/20 resize-none"
                                                placeholder="Tell us about the atmosphere you wish to create..."
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="pt-6">
                                            <button className="w-full bg-white text-slate-900 group py-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all active:scale-[0.98]">
                                                Send Inquiry <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder / Visual */}
            <section className="container mx-auto px-6 mb-24">
                <div className="h-[400px] bg-slate-100 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 cursor-crosshair group relative">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000"
                        alt="Map context"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[5000ms]"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs animate-fade-in translate-y-10 group-hover:translate-y-0 transition-all duration-700">
                            <MapPin className="text-slate-900 mx-auto mb-4" size={32} strokeWidth={1} />
                            <h4 className="font-serif text-xl mb-2 text-slate-900">Flagship Studio</h4>
                            <p className="text-xs text-slate-400 font-light mb-6">Open for private viewings by appointment only.</p>
                            <button className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 border-b border-indigo-100 pb-1">Get Directions</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
