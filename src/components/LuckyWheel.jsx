import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../data/menu';
import { X, Gift, Sparkles } from 'lucide-react';

export default function LuckyWheel({ onClose, onWin }) {
    const { luckyWheelSettings } = useStore();
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const canvasRef = useRef(null);
    const prizes = luckyWheelSettings.prizes;

    useEffect(() => {
        drawWheel(0);
    }, [prizes]);

    const drawWheel = (angle) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sliceAngle = (2 * Math.PI) / prizes.length;

        prizes.forEach((prize, i) => {
            const startAngle = angle + i * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.fillStyle = prize.color;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Outfit, sans-serif';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.fillText(prize.label, radius - 20, 5);
            ctx.restore();
        });

        // Draw center pin
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    };

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);

        // Calculate result based on probabilities
        const random = Math.random() * 100;
        let cumulative = 0;
        let winnerIndex = 0;

        for (let i = 0; i < prizes.length; i++) {
            cumulative += prizes[i].probability;
            if (random <= cumulative) {
                winnerIndex = i;
                break;
            }
        }

        const fullSpins = 5 + Math.floor(Math.random() * 5);
        const sliceAngle = (2 * Math.PI) / prizes.length;

        // Final angle: the prize should be at the top (top is -Math.PI / 2)
        // Adjust final angle so the arrow points to the middle of the slice
        const prizeCenterAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
        const targetRotation = (fullSpins * 2 * Math.PI) - prizeCenterAngle - (Math.PI / 2);

        let startTimestamp = null;
        const duration = 4000;

        const animate = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Cubic ease out
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentRotation = targetRotation * easedProgress;

            drawWheel(currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                setResult(prizes[winnerIndex]);
                if (onWin) onWin(prizes[winnerIndex]);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s' }}>
            <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem', background: 'white', maxWidth: '500px', width: '90%', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Gift size={28} /> Vòng Quay May Mắn
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thử vận may của bạn để nhận quà cực hời từ Snacky!</p>

                <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto 2rem' }}>
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        width: '0',
                        height: '0',
                        borderLeft: '15px solid transparent',
                        borderRight: '15px solid transparent',
                        borderTop: '30px solid var(--danger)',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}></div>

                    <canvas
                        ref={canvasRef}
                        width={320}
                        height={320}
                        style={{ border: '8px solid #f1f5f9', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    ></canvas>
                </div>

                {result ? (
                    <div className="animate-fade-in" style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '2px dashed var(--primary-color)' }}>
                        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Chúc mừng! Bạn đã nhận được:</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Sparkles size={24} color="#FFD700" />
                            {result.label}
                            <Sparkles size={24} color="#FFD700" />
                        </div>
                        {result.type === 'discount' && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: '500' }}>
                                (Đã được áp dụng mã giảm giá vào đơn hàng của bạn)
                            </div>
                        )}
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>
                            Tuyệt vời!
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        disabled={isSpinning}
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }}
                        onClick={spin}
                    >
                        {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
                    </button>
                )}
            </div>
        </div>
    );
}
