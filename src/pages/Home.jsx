import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ChefHat, Truck, Sparkles, X } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Chỉ hiện Welcome pop-up 1 lần khi mới vào trang (chưa có trong sessionStorage)
        if (!sessionStorage.getItem('welcomed')) {
            const timer = setTimeout(() => {
                setShowWelcome(true);
                sessionStorage.setItem('welcomed', 'true');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="glass-panel home-panel" style={{ textAlign: 'center', maxWidth: '500px', width: '100%', zIndex: 1, position: 'relative' }}>
                <h1 className="title animate-fade-in logo-bounce" style={{ marginBottom: '1.5rem' }}>
                    Snacky
                </h1>
                <p className="subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Thiên đường đồ ăn vặt
                </p>

                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2.5rem' }}>
                    <button
                        className="btn btn-primary animate-fade-in"
                        style={{ animationDelay: '0.2s', padding: '1.5rem', fontSize: '1.25rem', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
                        onClick={() => navigate('/menu/Bàn 1')}
                    >
                        <QrCode size={28} />
                        Mô phỏng Quét QR (ăn tại bàn)
                    </button>

                    <button
                        className="btn animate-fade-in"
                        style={{ animationDelay: '0.25s', padding: '1.5rem', fontSize: '1.25rem', justifyContent: 'center', background: 'var(--surface-color)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}
                        onClick={() => navigate('/menu/Giao Hàng')}
                    >
                        <Truck size={28} />
                        Mô phỏng Đặt Giao Hàng (Ship)
                    </button>

                    <button
                        className="btn animate-fade-in"
                        style={{ animationDelay: '0.3s', padding: '1.5rem', fontSize: '1.25rem', justifyContent: 'center', background: 'rgba(255,152,0,0.1)', border: '1px solid var(--glass-border)' }}
                        onClick={() => window.open('/admin', '_blank')}
                    >
                        <ChefHat size={28} />
                        Quản Lý Quán (Admin)
                    </button>
                </div>
            </div>

            <p style={{ marginTop: '2rem', color: 'var(--text-muted)', zIndex: 1, position: 'relative' }}>Mở Quản lý quán ở Tab mới để test thông báo nhận đơn</p>

            {/* Welcome Popup */}
            <div className={`success-modal ${showWelcome ? 'open' : ''}`} style={{ zIndex: 100 }}>
                <div className="success-content" style={{ position: 'relative' }}>
                    <button className="btn" style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.5rem', background: 'transparent', border: 'none' }} onClick={() => setShowWelcome(false)}>
                        <X size={20} color="var(--text-muted)" />
                    </button>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #ff6b6b)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 25px rgba(255, 87, 34, 0.3)'
                    }}>
                        <Sparkles size={34} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', marginBottom: '0.8rem', fontWeight: '800' }}>Chào mừng đến với Snacky!</h2>
                    <p style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Tặng mã <strong style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '4px' }}>SNACKYVIP</strong> giảm thẳng 20k cho đơn hàng của bạn hôm nay. Bấm chọn món thôi nàoo! 😋
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }} onClick={() => {
                        setShowWelcome(false);
                        navigate('/menu/Bàn 1');
                    }}>
                        Xem thực đơn ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
