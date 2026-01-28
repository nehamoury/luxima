import React, { useState } from 'react';
import { Search, ArrowRight, Bookmark, Share2, Clock, Calendar } from 'lucide-react';

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Interiors', 'Architecture', 'Lifestyle', 'Sustainability'];

    const posts = [
        {
            id: 1,
            title: "The Return of Maximalism: Why More is More",
            category: "Interiors",
            date: "Oct 24, 2024",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800",
            excerpt: "After a decade of beige and grey, the design world is embracing the bold beauty of layered textures, rich colors, and eclectic curation.",
            featured: true
        },
        {
            id: 2,
            title: "Choosing the Perfect Sofa for Small Spaces",
            category: "Lifestyle",
            date: "Oct 12, 2024",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
            excerpt: "A comprehensive guide to finding the balance between form and function when every square inch counts.",
            featured: false
        },
        {
            id: 3,
            title: "Sustainable Living: The Silent Power of Raw Materials",
            category: "Sustainability",
            date: "Sep 28, 2024",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1507473884658-c7a36524bb3f?auto=format&fit=crop&q=80&w=800",
            excerpt: "How to design a home that is good for you and the planet without compromising on opulence.",
            featured: false
        },
        {
            id: 4,
            title: "Lighting as Sculpture: Beyond the Bulb",
            category: "Architecture",
            date: "Sep 15, 2024",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1505693419173-42b9258a01b6?auto=format&fit=crop&q=80&w=800",
            excerpt: "Exploring how avant-garde lighting fixtures are redefining modern interior silhouettes.",
            featured: false
        },
        {
            id: 5,
            title: "The Emotional Impact of High Ceilings",
            category: "Architecture",
            date: "Sep 02, 2024",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
            excerpt: "Why architectural volume matters more than square footage for long-term well-being.",
            featured: false
        },
        {
            id: 6,
            title: "Curating a Minimalist Office Sanctuary",
            category: "Lifestyle",
            date: "Aug 20, 2024",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
            excerpt: "Design tools and furniture choices that foster deep focus and creative flow.",
            featured: false
        }
    ];

    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    const featuredPost = posts.find(p => p.featured);

    return (
        <div className="bg-white min-h-screen">
            {/* Page Header */}
            <header className="pt-32 pb-16 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">The Luxe Journal</p>
                            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">Stories of <br /><span className="italic text-slate-400">Atmosphere.</span></h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-slate-200 shadow-sm w-full md:w-80">
                            <Search className="w-4 h-4 text-slate-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search the journal..."
                                className="bg-transparent border-none outline-none text-sm w-full py-2 pr-4 font-light"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 overflow-hidden rounded-3xl">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <div className="lg:col-span-5 space-y-6">
                                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full">{featuredPost.category}</span>
                                    <span>&bull;</span>
                                    <span>{featuredPost.date}</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight group-hover:text-indigo-600 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-lg text-slate-500 font-light leading-relaxed">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="pt-4 flex items-center gap-6">
                                    <button className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold border-b border-slate-900 pb-1 group-hover:gap-5 transition-all">
                                        Read Article <ArrowRight size={14} />
                                    </button>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <button className="hover:text-slate-900 transition-colors"><Bookmark size={18} /></button>
                                        <button className="hover:text-slate-900 transition-colors"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Navigation */}
            <nav className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-y border-slate-100 py-6">
                <div className="container mx-auto px-6 flex justify-center gap-8 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
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
            </nav>

            {/* Post Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {filteredPosts.filter(p => !p.featured).map((post, idx) => (
                            <article key={post.id} className="group cursor-pointer flex flex-col h-full animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-8 relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-4">
                                    <div className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</div>
                                    <div className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</div>
                                </div>
                                <h3 className="text-2xl font-serif mb-4 group-hover:text-indigo-600 transition-colors leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:gap-4 transition-all w-fit">
                                    Read Full Story <ArrowRight size={12} />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journal CTA */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-white/10">
                        <Bookmark className="text-white" size={24} strokeWidth={1} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight max-w-3xl">
                        Deepen your <span className="italic text-slate-400">Design Intellect.</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-light max-w-xl mb-12 leading-relaxed">
                        Subscribe to our monthly digest for exclusive interviews with world-class architects and first looks at our private collections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
                            Join Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
