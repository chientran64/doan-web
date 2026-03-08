import React, { useState, useEffect } from 'react';
import { Coffee, Pizza, Utensils, Sandwich, Soup, IceCream } from 'lucide-react';

const floatingIcons = [
    { Icon: Coffee, size: 60, top: '10%', left: '5%', delay: '0s', duration: '12s', depth: 2 },
    { Icon: Pizza, size: 80, top: '20%', right: '10%', delay: '1s', duration: '15s', depth: -1.5 },
    { Icon: Utensils, size: 50, bottom: '15%', left: '15%', delay: '2s', duration: '10s', depth: 1.5 },
    { Icon: Sandwich, size: 90, bottom: '25%', right: '5%', delay: '0.5s', duration: '18s', depth: -2.5 },
    { Icon: Soup, size: 70, top: '40%', left: '25%', delay: '3s', duration: '14s', depth: 3 },
    { Icon: IceCream, size: 65, top: '60%', right: '20%', delay: '1.5s', duration: '16s', depth: -1 },
];

export default function FloatingBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -1,
            overflow: 'hidden'
        }}>
            {floatingIcons.map((icon, idx) => {
                const moveX = mousePos.x * 25 * icon.depth;
                const moveY = mousePos.y * 25 * icon.depth;

                return (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: icon.top,
                            bottom: icon.bottom,
                            left: icon.left,
                            right: icon.right,
                            width: `${icon.size}px`,
                            height: `${icon.size}px`,
                            transform: `translate(${moveX}px, ${moveY}px)`,
                            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.12,
                                color: 'var(--primary-color)',
                                animation: `float-around ${icon.duration} ease-in-out infinite`,
                                animationDelay: icon.delay,
                                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))',
                            }}
                        >
                            <icon.Icon size={icon.size} strokeWidth={1.5} />
                        </div>
                    </div>
                );
            })}
        </div >
    );
}
