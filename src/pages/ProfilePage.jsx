import React, { useState } from 'react';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, ShoppingBag, CreditCard, Shield } from 'lucide-react';

const ProfilePage = ({ user, orders, onLogout }) => {
    const [activeTab, setActiveTab] = useState('orders');

    if (!user) {
        return (
            <div className="min-h-screen pt-40 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <User className="text-slate-300" size={40} />
                </div>
                <h2 className="text-3xl font-serif mb-4">Your collection awaits.</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Please sign in to view your orders, saved items, and account settings.</p>
            </div>
        );
    }

    const userOrders = orders.filter(o => o.customer === user.name);

    return (
        <div className="bg-white min-h-screen selection:bg-slate-900 selection:text-white">
            <div className="pt-32 pb-24 container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-serif shadow-2xl shadow-slate-200">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-600 font-bold mb-2">Authenticated Patron</p>
                            <h1 className="text-4xl font-serif text-slate-900">{user.name}</h1>
                            <p className="text-slate-400 text-sm font-light mt-1">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all group"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-3 space-y-2">
                        {[
                            { id: 'orders', label: 'Order History', icon: Package },
                            { id: 'addresses', label: 'Addresses', icon: MapPin },
                            { id: 'payment', label: 'Payment Methods', icon: CreditCard },
                            { id: 'security', label: 'Security', icon: Shield },
                            { id: 'settings', label: 'Account Settings', icon: Settings },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 1.5} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                                </div>
                                <ChevronRight size={14} className={`transition-transform ${activeTab === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className="lg:col-span-9">
                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                    <h3 className="text-2xl font-serif text-slate-900">Purchase History</h3>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{userOrders.length} Total Orders</span>
                                </div>

                                {userOrders.length > 0 ? (
                                    <div className="space-y-6">
                                        {userOrders.map(order => (
                                            <div key={order.id} className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden relative">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order #{order.id}</p>
                                                        <p className="text-sm font-bold text-slate-900">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        {JSON.parse(typeof order.items === 'string' ? order.items : JSON.stringify(order.items)).map((item, i) => (
                                                            <div key={i} className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-2xl font-light text-slate-900 mb-1">₹{order.total.toLocaleString()}</p>
                                                        <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-slate-50 text-slate-500 border-slate-100'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                                    <ShoppingBag size={80} strokeWidth={0.5} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                        <ShoppingBag size={48} className="mx-auto mb-6 text-slate-300" strokeWidth={1} />
                                        <h4 className="text-xl font-serif text-slate-900 mb-2">No acquisitions yet.</h4>
                                        <p className="text-sm text-slate-400 mb-8">Your future masterpieces are waiting in our collections.</p>
                                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-indigo-600 transition-all shadow-xl">Start Collecting</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab !== 'orders' && (
                            <div className="py-24 text-center animate-in fade-in duration-500">
                                <Settings size={48} className="mx-auto mb-6 text-slate-200" strokeWidth={1} />
                                <h3 className="text-2xl font-serif text-slate-900 mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
                                <p className="text-slate-400 font-light max-w-sm mx-auto">This section is being curated. Our concierge team is working to bring you advanced management features soon.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
