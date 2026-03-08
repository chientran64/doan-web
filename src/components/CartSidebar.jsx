import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../data/menu';
import { X, Minus, Plus, ShoppingCart, Send, MapPin, Phone, User, Tag, CheckCircle, Gift } from 'lucide-react';
import LuckyWheel from './LuckyWheel';

export default function CartSidebar({ isOpen, onClose, tableId }) {
    const { cart, updateQuantity, removeFromCart, placeOrder, vouchers, luckyWheelSettings, addVoucher } = useStore();
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [voucher, setVoucher] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isOrdering, setIsOrdering] = useState(false);
    const [showWheel, setShowWheel] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    const total = Math.max(0, subtotal - discount);

    const applyVoucher = () => {
        const found = vouchers?.find(v => v.code.toUpperCase() === voucher.trim().toUpperCase() && v.isActive);
        if (found) {
            setDiscount(found.discount);
            alert(`Áp dụng mã giảm giá thành công! Giảm ${formatPrice(found.discount)}`);
        } else {
            setDiscount(0);
            alert('Mã không hợp lệ, đã hết hạn hoặc đang tạm khóa.');
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);

    const handleOrder = () => {
        if (cart.length === 0) return;

        if (tableId === 'Mang Đi' || tableId === 'Giao Hàng') {
            if (!phone) {
                alert('Vui lòng nhập số điện thoại để quán liên hệ nhé!');
                return;
            }
            if (!address) {
                alert('Vui lòng nhập địa chỉ nhận hàng!');
                return;
            }
        }

        setIsOrdering(true);
        setTimeout(() => {
            placeOrder(tableId || 'Mang Đi', customerName || 'Khách vãng lai', phone, address, note, discount);
            setIsOrdering(false);
            onClose();

            // Show new success modal and play sound
            setShowSuccess(true);
            const successAudio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
            successAudio.play().catch(e => console.log(e));

            // Clear form
            setCustomerName('');
            setPhone('');
            setAddress('');
            setNote('');
            setVoucher('');
            setDiscount(0);

            // Auto close success modal after 4s
            setTimeout(() => {
                setShowSuccess(false);

                // Show Lucky Wheel if eligible
                if (luckyWheelSettings.isActive && subtotal >= luckyWheelSettings.minOrderValue) {
                    setShowWheel(true);
                }
            }, 4000);
        }, 800);
    };

    const handleWin = (prize) => {
        if (prize.type === 'discount') {
            // Add a one-time voucher for the user
            const code = `WIN${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
            addVoucher({
                code: code,
                discount: prize.value,
                isActive: true
            });
            alert(`Mã giảm giá của bạn là: ${code}. Hãy lưu lại để sử dụng cho đơn sau nhé! 🎁`);
        } else if (prize.type === 'gift' && prize.value !== 'None') {
            alert(`Chúc mừng! Bạn nhận được: ${prize.value}. Hãy báo với chủ quán để nhận quà nhé! 🎁`);
        }
    };

    return (
        <>
            <div className={`backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <ShoppingCart /> Giỏ Hàng
                    </h2>
                    <button className="btn" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 152, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ShoppingCart size={48} color="var(--primary-color)" style={{ opacity: 0.8 }} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Giỏ hàng đang thút thít 😢</h3>
                        <p style={{ fontSize: '0.95rem' }}>Chưa có món nào, mau lấp đầy bụng thôi!</p>
                    </div>
                ) : (
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1 }}>
                            {cart.map((item, index) => (
                                <div key={item.cartItemId} className="animate-fade-in" style={{ padding: '1rem', marginBottom: '0.8rem', display: 'flex', gap: '1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', animationDelay: `${index * 0.05}s` }}>
                                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                            <div>
                                                <h4 style={{ marginBottom: '0.2rem', fontSize: '1.05rem', fontWeight: 'bold' }}>{item.name}</h4>
                                                {item.optionsText && (
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {item.optionsText}
                                                    </p>
                                                )}
                                            </div>
                                            <button className="btn" style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)', background: 'transparent', marginTop: '-0.3rem' }} onClick={() => removeFromCart(item.cartItemId)}>
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                                            <p className="food-price" style={{ fontSize: '1rem', marginBottom: 0 }}>{formatPrice(item.finalPrice)}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', padding: '0.25rem', borderRadius: '99px' }}>
                                                <button className="btn" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }} onClick={() => updateQuantity(item.cartItemId, -1)}><Minus size={14} /></button>
                                                <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center', fontSize: '0.95rem' }}>{item.quantity}</span>
                                                <button className="btn" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }} onClick={() => updateQuantity(item.cartItemId, 1)}><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Receipt Form Block */}
                        <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Thông tin nhận hàng</h3>

                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <User size={18} color="var(--primary-color)" />
                                    <input type="text" placeholder="Tên của bạn *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.8rem', outline: 'none', boxShadow: 'none', fontSize: '0.95rem' }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <Phone size={18} color="var(--primary-color)" />
                                    <input type="text" placeholder="Số điện thoại *" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.8rem', outline: 'none', boxShadow: 'none', fontSize: '0.95rem' }} />
                                </div>

                                {(!tableId || tableId === 'Mang Đi' || tableId === 'Giao Hàng') && (
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                        <MapPin size={18} color="var(--primary-color)" />
                                        <input type="text" placeholder="Địa chỉ nhận hàng *" value={address} onChange={(e) => setAddress(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.8rem', outline: 'none', boxShadow: 'none', fontSize: '0.95rem' }} />
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'flex-start', background: 'white', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <textarea placeholder="Ghi chú thêm (ít cay, nhiều đá...)" value={note} onChange={(e) => setNote(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', boxShadow: 'none', resize: 'none', padding: '0.2rem', fontFamily: 'inherit', minHeight: '60px', fontSize: '0.95rem' }} />
                                </div>
                            </div>
                        </div>

                        {/* Checkout Block */}
                        <div style={{ marginTop: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(145deg, var(--primary-color), #ff6b6b)', borderRadius: '20px', color: 'white', padding: '1.5rem', boxShadow: '0 10px 25px rgba(255, 87, 34, 0.3)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.2)', padding: '0 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                                    <Tag size={18} color="white" />
                                    <input type="text" placeholder="Mã giảm giá" value={voucher} onChange={(e) => setVoucher(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.8rem', outline: 'none', boxShadow: 'none', textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} className="placeholder-white" />
                                </div>
                                <button className="btn" style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', color: 'var(--primary-color)', fontWeight: 'bold', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onClick={applyVoucher}>
                                    Áp dụng
                                </button>
                            </div>

                            <div className="flex-between" style={{ marginBottom: '0.5rem', opacity: 0.9 }}>
                                <span>Tạm tính</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex-between" style={{ marginBottom: '0.5rem', color: '#ffd600', fontWeight: 'bold' }}>
                                    <span>Khuyến mãi</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.3)', margin: '1rem 0' }}></div>

                            <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>TỔNG CỘNG</span>
                                <span style={{ fontSize: '1.6rem', color: 'white' }}>{formatPrice(total)}</span>
                            </div>

                            <button
                                className="btn"
                                style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem', borderRadius: '12px', background: 'white', color: 'var(--primary-color)', fontWeight: 'bold', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                                onClick={handleOrder}
                                disabled={isOrdering}
                            >
                                {isOrdering ? 'ĐANG GỬI...' : 'XÁC NHẬN ĐẶT MÓN'} <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Success Modal */}
            <div className={`success-modal ${showSuccess ? 'open' : ''}`}>
                <div className="success-content">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--success), #34d399)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)', animation: showSuccess ? 'pulse-glow 2s infinite' : 'none'
                    }}>
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--success)', marginBottom: '1rem', fontWeight: '800' }}>Tuyệt Vời!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                        Đơn hàng của bạn đã được đầu bếp tiếp nhận. Vui lòng chờ trong giây lát nhé! 👨‍🍳🛵
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)' }} onClick={() => setShowSuccess(false)}>
                        Đóng ngay
                    </button>
                </div>
                {/* Fullscreen CSS Confetti */}
                {showSuccess && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
                        {[...Array(60)].map((_, i) => {
                            const size = Math.random() * 10 + 6;
                            return (
                                <div key={i} style={{
                                    position: 'absolute',
                                    width: `${size}px`,
                                    height: `${size * 2}px`,
                                    background: ['#ff5722', '#ff9800', '#10b981', '#3b82f6', '#f43f5e', '#a855f7', '#fde047'][Math.floor(Math.random() * 7)],
                                    left: `${Math.random() * 100}%`,
                                    top: '-10vh',
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    opacity: Math.random() + 0.5,
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                    animation: `confetti-fall ${Math.random() * 3 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                                    animationDelay: `${Math.random() * 0.8}s`
                                }} />
                            );
                        })}
                    </div>
                )}
            </div>

            {showWheel && (
                <LuckyWheel
                    onClose={() => setShowWheel(false)}
                    onWin={handleWin}
                />
            )}
        </>
    );
}
