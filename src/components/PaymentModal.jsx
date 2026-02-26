import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, total, onPaymentSuccess }) => {
    const [step, setStep] = useState('input'); // input, processing, success
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    useEffect(() => {
        if (isOpen) {
            setStep('input');
        }
    }, [isOpen]);

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const discountAmount = appliedCoupon
        ? (appliedCoupon.discount_type === 'percentage'
            ? (total * appliedCoupon.discount_value / 100)
            : parseFloat(appliedCoupon.discount_value))
        : 0;

    const finalTotal = total - discountAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidating(true);
        setCouponError('');
        try {
            const coupon = await api.validateCoupon(couponCode, total);
            setAppliedCoupon(coupon);
            setCouponCode('');
        } catch (err) {
            setCouponError(err.message);
        } finally {
            setIsValidating(false);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setStep('processing');

        // Simulate payment processing
        setTimeout(() => {
            setStep('success');
            // Notify parent after a short delay
            setTimeout(() => {
                onPaymentSuccess(finalTotal, appliedCoupon?.code);
            }, 2000);
        }, 3000);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                {step !== 'success' && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="p-8 md:p-12">
                    {step === 'input' && (
                        <>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <CreditCard size={20} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900">Secure Payment</h3>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Cardholder Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ALEXANDER PIERCE"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium uppercase tracking-wider"
                                        value={cardDetails.name}
                                        onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                            value={cardDetails.number}
                                            onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                            <div className="w-6 h-4 bg-slate-200 rounded-sm"></div>
                                            <div className="w-6 h-4 bg-slate-300 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Expiry Date</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="MM / YY"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                            value={cardDetails.expiry}
                                            onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">CVV</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="***"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                            value={cardDetails.cvv}
                                            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100 italic">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-slate-900 font-bold">₹{total.toLocaleString()}</span>
                                    </div>

                                    {appliedCoupon ? (
                                        <div className="flex justify-between items-center text-sm text-emerald-600 animate-in fade-in slide-in-from-left-2 transition-all">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                    {appliedCoupon.code}
                                                </span>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Promo Code</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="ENTER CODE"
                                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-bold tracking-widest uppercase"
                                                    value={couponCode}
                                                    onChange={e => setCouponCode(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    disabled={isValidating || !couponCode}
                                                    onClick={handleApplyCoupon}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50"
                                                >
                                                    {isValidating ? '...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponError && <p className="text-[10px] text-rose-500 font-bold italic">{couponError}</p>}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-lg border-t border-slate-100 pt-4">
                                        <span className="font-serif text-slate-900">Total Due</span>
                                        <span className="text-slate-900 font-bold">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]"
                                    >
                                        Pay ₹{finalTotal.toLocaleString()}
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock size={14} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Secure Storage</span>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="py-20 flex flex-col items-center text-center">
                            <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Processing Authority</h3>
                            <p className="text-slate-400 text-sm font-light">Authenticating your transaction with the provider...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-50 duration-500">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Payment Verified</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                Your transaction of <span className="font-bold font-sans">₹{total.toLocaleString()}</span> has been processed successfully.
                            </p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
