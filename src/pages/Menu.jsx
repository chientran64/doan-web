import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatPrice, categories } from '../data/menu';
import { ShoppingBag, Plus, X, Search, Clock, ChefHat, CheckCircle, Truck, Users, Copy, Link, MessageCircle, Send } from 'lucide-react';
import CartSidebar from '../components/CartSidebar';

export default function Menu() {
    const { tableId } = useParams();
    const location = useLocation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [customerName, setCustomerName] = useState(localStorage.getItem('chat_name') || '');
    const [customerPhone, setCustomerPhone] = useState(localStorage.getItem('chat_phone') || '');
    const { menuItems, cart, addToCart, orders, messages, addMessage } = useStore();
    const [trackingPhone, setTrackingPhone] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemOptions, setItemOptions] = useState({});
    const [activeCategory, setActiveCategory] = useState('all');
    const [flyingItems, setFlyingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Group Ordering State
    const [isGroupOrdering, setIsGroupOrdering] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupLinkUrl, setGroupLinkUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Automatically join group order if URL has group param
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has('group_session')) {
            setIsGroupOrdering(true);
        }
    }, [location]);

    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const displayTable = tableId !== 'Giao Hàng' ? tableId : 'Đơn Giao Hàng';

    const triggerFlyAnimation = (e, image) => {
        if (!e) return;
        const rect = e.currentTarget.getBoundingClientRect();

        // Find the best cart target (floating pill first, then header)
        const floatingCart = document.getElementById('cart-btn-floating');
        const headerCart = document.getElementById('cart-btn-header');
        const target = floatingCart || headerCart;

        let destX = window.innerWidth - 80;
        let destY = 40;

        if (target) {
            const targetRect = target.getBoundingClientRect();
            destX = targetRect.left + targetRect.width / 2;
            destY = targetRect.top + targetRect.height / 2;
        }

        const dx = destX - rect.left;
        const dy = destY - rect.top;

        const newFly = {
            id: Date.now() + Math.random(),
            image: image,
            x: rect.left,
            y: rect.top,
            dx,
            dy
        };

        setFlyingItems(prev => [...prev, newFly]);
        setTimeout(() => {
            setFlyingItems(prev => prev.filter(f => f.id !== newFly.id));
        }, 800);
    };

    const handleAddClick = (e, item) => {
        if (item.soldOut) {
            alert('Món này tạm thời đã hết, bạn chọn món khác nhé!');
            return;
        }

        if (item.options && item.options.length > 0) {
            setSelectedItem(item);
            const defaultOpts = {};
            item.options.forEach(opt => {
                if (opt.type === 'single' && opt.choices.length > 0) {
                    defaultOpts[opt.id] = opt.choices[0].name;
                } else if (opt.type === 'multiple') {
                    defaultOpts[opt.id] = [];
                }
            });
            setItemOptions(defaultOpts);
        } else {
            triggerFlyAnimation(e, item.image);
            addToCart(item);
        }
    };

    const handleOptionChange = (optId, type, choiceName, checked) => {
        setItemOptions(prev => {
            const newOpts = { ...prev };
            if (type === 'single') {
                newOpts[optId] = choiceName;
            } else {
                const current = newOpts[optId] || [];
                if (checked) {
                    newOpts[optId] = [...current, choiceName];
                } else {
                    newOpts[optId] = current.filter(c => c !== choiceName);
                }
            }
            return newOpts;
        });
    };

    const confirmAddToCart = (e) => {
        triggerFlyAnimation(e, selectedItem.image);
        addToCart(selectedItem, itemOptions);
        setSelectedItem(null);
    };

    const handleStartGroupOrder = () => {
        setIsGroupOrdering(true);
        // Tự động append thêm tham số ảo vào URL để giống như một link được chia sẻ
        const groupUrl = `${window.location.origin}${window.location.pathname}?group_session=abc123yz`;
        setGroupLinkUrl(groupUrl);
        setShowGroupModal(true);
        setIsCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(groupLinkUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    let modalTempPrice = selectedItem ? selectedItem.price : 0;
    if (selectedItem) {
        selectedItem.options?.forEach(opt => {
            if (opt.type === 'single') {
                const choice = opt.choices.find(c => c.name === itemOptions[opt.id]);
                if (choice) modalTempPrice += choice.price;
            } else if (opt.type === 'multiple') {
                const selected = itemOptions[opt.id] || [];
                selected.forEach(cName => {
                    const choice = opt.choices.find(c => c.name === cName);
                    if (choice) modalTempPrice += choice.price;
                });
            }
        });
    }

    // Filter menu
    const filteredMenu = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <div className="container">
                <header className="flex-between" style={{ marginBottom: '2rem', padding: '1rem 0' }}>
                    <div>
                        <h1 className="title logo-bounce" style={{ marginBottom: '0.2rem' }}>Snacky</h1>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span>📍 123 Đường Bách Khoa, Hai Bà Trưng, Hà Nội</span>
                            <span>📞 Hotline: 0987.654.321</span>
                        </div>
                        <div className="badge badge-preparing" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            Khách - {displayTable || 'Mang đi'}
                            {isGroupOrdering && <span style={{ background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Ghép đơn</span>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end' }}>
                        <div className="header-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {!isGroupOrdering && (
                                <button
                                    className="btn glass-panel"
                                    style={{ position: 'relative', border: '1px solid var(--border-color)', background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', color: '#4f46e5' }}
                                    onClick={handleStartGroupOrder}
                                >
                                    <Users color="#4f46e5" size={18} />
                                    <span style={{ fontWeight: 'bold' }}>Đặt Chung</span>
                                </button>
                            )}
                            <button
                                className="btn glass-panel"
                                style={{ position: 'relative', border: '1px solid var(--border-color)', background: 'white' }}
                                onClick={() => setIsChatOpen(true)}
                            >
                                <MessageCircle color="var(--primary-color)" size={18} />
                                <span style={{ fontWeight: 'bold' }}>Nhắn Tin</span>
                            </button>
                            <button
                                className="btn glass-panel"
                                style={{ position: 'relative', border: '1px solid var(--border-color)', background: 'white' }}
                                onClick={() => setIsTrackingOpen(true)}
                            >
                                <Search color="var(--primary-color)" size={18} />
                                <span style={{ fontWeight: 'bold' }}>Theo Dõi</span>
                            </button>
                            <button
                                id="cart-btn-header"
                                className="btn glass-panel"
                                style={{ position: 'relative', border: '1px solid var(--primary-color)' }}
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingBag color="var(--primary-color)" />
                                <span style={{ fontWeight: 'bold' }}>Giỏ Hàng</span>
                                {cartItemsCount > 0 && (
                                    <span className="pulse-badge" style={{
                                        position: 'absolute', top: '-8px', right: '-8px',
                                        background: 'var(--primary-color)', color: 'white',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 'bold', border: '2px solid white', animation: 'none'
                                    }}>
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Integrated Search Bar */}
                        <div className="glass-panel" style={{
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '100px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid var(--border-color)',
                            width: '100%',
                            maxWidth: '350px',
                            background: 'white'
                        }}>
                            <Search size={18} color="var(--primary-color)" />
                            <input
                                type="text"
                                placeholder="Bạn muốn ăn món gì?..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-main)'
                                }}
                            />
                            {searchQuery && (
                                <X size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                            )}
                        </div>
                    </div>
                </header>

                {/* Promotional Banner */}
                <div
                    className="promo-banner animate-fade-in"
                    style={{ animationDelay: '0.1s', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
                    onClick={() => setActiveCategory('an_vat')}
                >
                    <div className="promo-banner-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Combo Cực Đã 🔥</h2>
                        <p style={{ opacity: 0.9, marginBottom: '0', fontSize: '0.95rem' }}>Đồng giá Ăn Vặt chỉ từ 10K. Khám phá ngay!</p>
                    </div>
                    <div className="promo-banner-content">
                        <button className="btn" style={{
                            background: 'white',
                            color: 'var(--primary-color)',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            fontSize: '0.95rem',
                            borderRadius: '99px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            Săn ngay
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div style={{
                    position: 'sticky',
                    top: '10px',
                    zIndex: 40,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(16px)',
                    margin: '0.5rem 0 3rem 0',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    gap: '0.8rem',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    borderRadius: '100px',
                    boxShadow: '0 8px 32px rgba(47, 53, 66, 0.08)',
                    border: '1px solid var(--glass-border)',
                }}>
                    <button
                        className="btn"
                        style={{
                            borderRadius: '99px',
                            border: 'none',
                            background: activeCategory === 'all' ? 'var(--primary-color)' : 'transparent',
                            color: activeCategory === 'all' ? 'white' : 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            boxShadow: activeCategory === 'all' ? '0 4px 12px var(--primary-glow)' : 'none',
                            padding: '0.6rem 1.2rem'
                        }}
                        onClick={() => setActiveCategory('all')}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className="btn"
                            style={{
                                borderRadius: '99px',
                                border: 'none',
                                background: activeCategory === cat.id ? 'var(--primary-color)' : 'transparent',
                                color: activeCategory === cat.id ? 'white' : 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                boxShadow: activeCategory === cat.id ? '0 4px 15px var(--primary-glow)' : 'none',
                                padding: '0.6rem 1.2rem'
                            }}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid-cards">
                    {filteredMenu.map((item, index) => (
                        <div
                            key={item.id}
                            className="food-card animate-fade-in glass-panel"
                            style={{ animationDelay: `${index * 0.05}s`, borderRadius: 'var(--radius)', opacity: item.soldOut ? 0.6 : 1 }}
                        >
                            <div className="food-img-wrapper" style={{ borderRadius: 'var(--radius) var(--radius) 0 0', position: 'relative' }}>
                                {item.isBestseller && !item.soldOut && <div className="bestseller-badge">🔥 Bán chạy</div>}
                                {item.soldOut && <div className="sold-out-ribbon">Hết Hàng</div>}

                                {/* Added Quantity display if item is in cart */}
                                {(() => {
                                    const qtyInCart = cart.filter(c => c.id === item.id).reduce((sum, c) => sum + c.quantity, 0);
                                    if (qtyInCart > 0) {
                                        return (
                                            <div style={{
                                                position: 'absolute', top: '10px', right: '10px',
                                                background: 'var(--primary-color)', color: 'white',
                                                fontWeight: 'bold', width: '32px', height: '32px',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', boxShadow: '0 4px 10px rgba(255, 87, 34, 0.4)',
                                                zIndex: 10, border: '2px solid white', fontSize: '0.9rem'
                                            }}>
                                                {qtyInCart}
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'} alt={item.name} className="food-img" loading="lazy" style={{ filter: item.soldOut ? 'grayscale(100%)' : 'none' }} />

                                {!item.soldOut && (
                                    <div className="quick-add-overlay" onClick={(e) => {
                                        const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
                                        audio.play().catch(err => console.log('Audio error:', err));
                                        handleAddClick(e, item)
                                    }}>
                                        <div className="quick-add-btn">
                                            <Plus size={24} /> Thêm nhanh
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="food-content">
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                                    {item.description}
                                </p>
                                <div className="flex-between" style={{ marginTop: 'auto' }}>
                                    <span className="food-price">{formatPrice(item.price)}</span>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.6rem', borderRadius: '50%', background: item.soldOut ? 'var(--text-muted)' : '', boxShadow: item.soldOut ? 'none' : '' }}
                                        onClick={(e) => {
                                            const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
                                            audio.play().catch(err => console.log('Audio error:', err));
                                            handleAddClick(e, item)
                                        }}
                                        disabled={item.soldOut}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredMenu.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>Không có món nào trong phân loại này.</p>
                    )}
                </div>
            </div>

            {/* Floating Cart Summary Pill */}
            {cartItemsCount > 0 && (
                <div
                    id="cart-btn-floating"
                    className="cart-floating-pill animate-fade-in"
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: 'linear-gradient(135deg, var(--primary-color), #ff6b6b)',
                        color: 'white',
                        padding: '0.8rem 1.2rem',
                        borderRadius: '99px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 25px rgba(255, 87, 34, 0.4)',
                        zIndex: 90,
                        cursor: 'pointer',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => setIsCartOpen(true)}
                >
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <ShoppingBag size={24} />
                        <span style={{
                            position: 'absolute', top: '-10px', right: '-12px',
                            background: 'white', color: 'var(--primary-color)',
                            width: '22px', height: '22px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            {cartItemsCount}
                        </span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '12px' }}>
                        Giỏ hàng
                    </div>
                </div>
            )}

            {/* Flying Food Animation */}
            {flyingItems.map(fly => (
                <img
                    key={fly.id}
                    src={fly.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'}
                    className="flying-food"
                    style={{ left: fly.x, top: fly.y, '--dx': `${fly.dx}px`, '--dy': `${fly.dy}px` }}
                    alt=""
                />
            ))}

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                tableId={tableId}
            />

            {/* Chat Sidebar */}
            <div className={`sidebar ${isChatOpen ? 'open' : ''}`} style={{ zIndex: 100, display: 'flex', flexDirection: 'column' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <MessageCircle /> Nhắn Với Chủ Quán
                    </h2>
                    <button className="btn" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }} onClick={() => setIsChatOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    {(!customerName || !customerPhone) ? (
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'white', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Thông tin liên hệ</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Bạn vui lòng để lại tên và SĐT để chủ quán có thể liên hệ lại khi cần nhé!</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Tên của bạn</label>
                                    <input
                                        type="text"
                                        placeholder="VD: Nguyễn Văn A"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        placeholder="VD: 0987xxx..."
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: '0.5rem' }}
                                    onClick={() => {
                                        if (customerName.trim() && customerPhone.trim()) {
                                            localStorage.setItem('chat_name', customerName);
                                            localStorage.setItem('chat_phone', customerPhone);
                                            setCustomerName(customerName);
                                            setCustomerPhone(customerPhone);
                                        } else {
                                            alert('Vui lòng nhập đầy đủ thông tin!');
                                        }
                                    }}
                                >
                                    Bắt đầu chat ngay
                                </button>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                            <p>Chào <b>{customerName}</b>! Snacky đã sẵn sàng hỗ trợ bạn. 😊</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    alignSelf: msg.role === 'customer' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    background: msg.role === 'customer' ? 'var(--primary-color)' : 'white',
                                    color: msg.role === 'customer' ? 'white' : 'var(--text-main)',
                                    padding: '0.8rem 1rem',
                                    borderRadius: msg.role === 'customer' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    border: msg.role === 'owner' ? '1px solid var(--border-color)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    opacity: 0.7,
                                    marginTop: '0.3rem',
                                    textAlign: 'right'
                                }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'white',
                    padding: '0.8rem',
                    borderRadius: '100px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                    opacity: (!customerName || !customerPhone) ? 0.5 : 1,
                    pointerEvents: (!customerName || !customerPhone) ? 'none' : 'auto'
                }}>
                    <input
                        type="text"
                        placeholder="Nhập nội dung..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && (addMessage({ role: 'customer', text: chatInput, customerName, customerPhone }), setChatInput(''))}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            padding: '0 0.5rem'
                        }}
                    />
                    <button
                        className="btn"
                        onClick={() => chatInput.trim() && (addMessage({ role: 'customer', text: chatInput, customerName, customerPhone }), setChatInput(''))}
                        style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            minWidth: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Tracking Sidebar */}
            <div className={`sidebar ${isTrackingOpen ? 'open' : ''}`} style={{ zIndex: 100 }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <Search /> Tra Cứu Đơn
                    </h2>
                    <button className="btn" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }} onClick={() => setIsTrackingOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Nhập SĐT đã đặt hàng..."
                        value={trackingPhone}
                        onChange={(e) => setTrackingPhone(e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.8rem', outline: 'none', boxShadow: 'none' }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                    {trackingPhone.length >= 4 ? (
                        orders.filter(o => o.phone.includes(trackingPhone)).length > 0 ? (
                            orders.filter(o => o.phone.includes(trackingPhone)).map(order => (
                                <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'white', position: 'relative', overflow: 'hidden' }}>
                                    <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.8rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>Đơn #{order.id}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', marginTop: '1rem' }}>
                                        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px', background: 'var(--border-color)', zIndex: 0 }}>
                                            <div style={{ height: '100%', background: 'linear-gradient(90deg, #ff9800, #3b82f6, #10b981)', width: order.status === 'pending' ? '0%' : order.status === 'preparing' ? '33%' : order.status === 'delivering' ? '66%' : '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: `2px solid ${order.status !== 'completed' ? 'var(--primary-color)' : 'var(--success)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: order.status !== 'completed' ? 'var(--primary-color)' : 'var(--success)', animation: order.status === 'pending' ? 'pulse-glow 2s infinite' : 'none' }}>
                                                <Clock size={18} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Chờ nhận</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem', opacity: order.status === 'pending' ? 0.4 : 1, transition: 'opacity 0.5s' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: `2px solid ${order.status === 'preparing' ? 'var(--primary-color)' : (order.status === 'delivering' || order.status === 'completed') ? 'var(--success)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: order.status === 'preparing' ? 'var(--primary-color)' : (order.status === 'delivering' || order.status === 'completed') ? 'var(--success)' : 'var(--border-color)', animation: order.status === 'preparing' ? 'pulse-glow 2s infinite' : 'none' }}>
                                                <ChefHat size={18} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Đang làm</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem', opacity: (order.status === 'pending' || order.status === 'preparing') ? 0.4 : 1, transition: 'opacity 0.5s' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: `2px solid ${order.status === 'delivering' ? '#3b82f6' : order.status === 'completed' ? 'var(--success)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: order.status === 'delivering' ? '#3b82f6' : order.status === 'completed' ? 'var(--success)' : 'var(--border-color)', animation: order.status === 'delivering' ? 'pulse-glow 2s infinite' : 'none' }}>
                                                <Truck size={18} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Đang giao</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem', opacity: order.status === 'completed' ? 1 : 0.4, transition: 'opacity 0.5s' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: `2px solid ${order.status === 'completed' ? 'var(--success)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: order.status === 'completed' ? 'var(--success)' : 'var(--border-color)', animation: order.status === 'completed' ? 'pulse-glow 2s infinite' : 'none' }}>
                                                <CheckCircle size={18} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Hoàn thành</span>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                        Món: {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        Tổng: {formatPrice(order.total)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                                <Search size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <p>Không tìm thấy đơn hàng nào cho SĐT này.</p>
                            </div>
                        )
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
                            <p>Nhập từ 4 số cuối điện thoại trở lên để tra cứu dễ dàng nhé!</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`backdrop ${selectedItem || isTrackingOpen ? 'open' : ''}`} onClick={() => { setSelectedItem(null); setIsTrackingOpen(false); }} />
            <div className={`modal ${selectedItem ? 'open' : ''}`}>
                {selectedItem && (
                    <>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{selectedItem.name}</h2>
                            <button className="btn" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }} onClick={() => setSelectedItem(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {selectedItem.options?.map(opt => (
                                <div key={opt.id} style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                        {opt.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                                            ({opt.type === 'single' ? 'Chọn 1' : 'Chọn nhiều'})
                                        </span>
                                    </h4>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        {opt.choices.map(choice => (
                                            <label
                                                key={choice.name}
                                                className={`radio-btn ${(opt.type === 'single' ? itemOptions[opt.id] === choice.name : itemOptions[opt.id]?.includes(choice.name)) ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type={opt.type === 'single' ? 'radio' : 'checkbox'}
                                                    name={opt.id}
                                                    checked={opt.type === 'single' ? itemOptions[opt.id] === choice.name : (itemOptions[opt.id] || []).includes(choice.name)}
                                                    onChange={(e) => handleOptionChange(opt.id, opt.type, choice.name, e.target.checked)}
                                                    style={{ width: 'auto', margin: 0 }}
                                                />
                                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{choice.name}</span>
                                                    {choice.price > 0 && <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>+{formatPrice(choice.price)}</span>}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', justifyContent: 'space-between', fontSize: '1.1rem' }}
                                onClick={confirmAddToCart}
                            >
                                <span>Thêm vào giỏ</span>
                                <span style={{ fontWeight: 'bold' }}>{formatPrice(modalTempPrice)}</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Group Order Share Link Modal */}
            <div className={`success-modal ${showGroupModal ? 'open' : ''}`} style={{ zIndex: 110 }}>
                <div className="success-content" style={{ position: 'relative', maxWidth: '400px' }}>
                    <button
                        className="btn"
                        style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.5rem', background: 'transparent', border: 'none' }}
                        onClick={() => setShowGroupModal(false)}
                    >
                        <X size={20} color="var(--text-muted)" />
                    </button>

                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)'
                    }}>
                        <Users size={32} color="#4f46e5" />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', color: '#4f46e5', marginBottom: '0.8rem', fontWeight: '800' }}>Gọi món chung bàn</h2>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Gửi link này cho bạn bè để mọi người cùng thêm đồ ăn vào chung một Giỏ hàng nhé!
                    </p>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                        padding: '0.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem'
                    }}>
                        <div style={{ padding: '0 0.5rem' }}>
                            <Link size={18} color="var(--text-muted)" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={groupLinkUrl}
                            style={{
                                flex: 1, border: 'none', background: 'transparent',
                                outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem',
                                padding: 0
                            }}
                        />
                        <button
                            className="btn"
                            style={{
                                background: isCopied ? '#10b981' : 'var(--primary-color)',
                                color: 'white', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={copyToClipboard}
                        >
                            {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                            {isCopied ? 'Đã chép' : 'Sao chép'}
                        </button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                        Trải nghiệm giả lập không cần đăng nhập 🚀
                    </p>
                </div>
            </div>
        </>
    );
}
