import React from 'react';
import { Printer, X, Download } from 'lucide-react';

const InvoiceView = ({ order, onClose }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
                {/* Header Actions */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all"
                        >
                            <Printer size={16} /> Print Invoice
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Printable Content */}
                <div className="flex-1 overflow-y-auto p-12 md:p-16 bg-white selection:bg-slate-900 selection:text-white print:p-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-serif font-bold text-slate-900">LuxeHomé.</h2>
                            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                                42 Aesthetic Plaza, Elite District<br />
                                London, United Kingdom<br />
                                contact@luxehome.com
                            </p>
                        </div>
                        <div className="text-right space-y-2">
                            <h3 className="text-4xl font-serif text-slate-200">INVOICE</h3>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">#{order.id.toString().padStart(6, '0')}</p>
                            <p className="text-xs text-slate-400 font-bold">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-4">Billed To</p>
                            <h4 className="font-bold text-slate-900 mb-2">{order.customer}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                Premium Patron Member<br />
                                Verified Address on Profile
                            </p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-300 mb-4">Payment Status</p>
                            <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                {order.status === 'Cancelled' ? 'Refunded' : 'Paid in Full'}
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-20">
                        <thead className="border-b-2 border-slate-900">
                            <tr>
                                <th className="py-4 text-left text-[10px] uppercase tracking-widest font-bold text-slate-900">Description</th>
                                <th className="py-4 text-center text-[10px] uppercase tracking-widest font-bold text-slate-900">Qty</th>
                                <th className="py-4 text-right text-[10px] uppercase tracking-widest font-bold text-slate-900">Unit Price</th>
                                <th className="py-4 text-right text-[10px] uppercase tracking-widest font-bold text-slate-900">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {order.items.map((item, i) => (
                                <tr key={i}>
                                    <td className="py-6">
                                        <p className="font-bold text-slate-900">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.category || 'Luxury Piece'}</p>
                                    </td>
                                    <td className="py-6 text-center text-sm font-bold text-slate-900">1</td>
                                    <td className="py-6 text-right text-sm text-slate-400">₹{item.price.toLocaleString()}</td>
                                    <td className="py-6 text-right text-sm font-bold text-slate-900">₹{item.price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-full md:w-64 space-y-4">
                            <div className="flex justify-between text-sm italic">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-slate-900 font-bold">₹{order.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm italic">
                                <span className="text-slate-400">VAT (Stored)</span>
                                <span className="text-slate-900 font-bold">₹0.00</span>
                            </div>
                            <div className="flex justify-between text-xl border-t-2 border-slate-900 pt-4">
                                <span className="font-serif text-slate-900">Grand Total</span>
                                <span className="text-slate-900 font-bold">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-40 pt-10 border-t border-slate-50 text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-bold">Thank you for your patronage</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;
