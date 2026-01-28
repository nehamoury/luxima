import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, X } from 'lucide-react';
import { api } from '../api';

const AuthModal = ({ isOpen, onClose, onLogin, allowSignup = true }) => {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                const newUser = { ...formData, role: 'user' };
                const savedUser = await api.signup(newUser);
                localStorage.setItem('luxehome-user', JSON.stringify(savedUser));
                onLogin(savedUser);
                onClose();
            } else {
                if (formData.email === 'admin@luxehome.com' && formData.password === 'admin123') {
                    // Creating admin session manually for demo
                    const adminUser = { id: 1, name: 'Administrator', email: 'admin@luxehome.com', role: 'admin' };
                    localStorage.setItem('luxehome-user', JSON.stringify(adminUser));
                    onLogin(adminUser);
                    onClose();
                    setLoading(false);
                    return;
                }

                const user = await api.login(formData.email, formData.password);
                if (user) {
                    localStorage.setItem('luxehome-user', JSON.stringify(user));
                    onLogin(user);
                    onClose();
                } else {
                    setError('Invalid credentials');
                }
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold mb-2 tracking-tighter text-slate-900">LUXIMA<span className="text-indigo-500">.</span></h2>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">
                            {mode === 'login' ? 'Welcome Back' : 'Join the Collection'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-rose-500 text-sm text-center font-medium bg-rose-50 p-3 rounded-lg">{error}</p>}
                        {mode === 'signup' && (
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                mode === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {allowSignup && (
                        <div className="mt-8 text-center text-sm">
                            <p className="text-slate-400 mb-2">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'signup' : 'login');
                                    setError('');
                                }}
                                className="font-bold text-slate-900 underline underline-offset-4 hover:text-slate-600 transition-colors"
                            >
                                {mode === 'login' ? 'Create Account' : 'Sign In'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
