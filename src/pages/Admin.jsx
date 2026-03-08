import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatPrice, categories } from '../data/menu';
import { CheckCircle, Clock, ChefHat, AlertCircle, RefreshCw, Trash2, Plus, BarChart2, Store, ListOrdered, Phone, MapPin, Tag, Truck, MessageSquare, Send, User, Dna, Gift } from 'lucide-react';

export default function Admin() {
    const {
        orders, updateOrderStatus, menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
        vouchers, addVoucher, updateVoucher, deleteVoucher, messages, addMessage,
        luckyWheelSettings, updateLuckyWheelSettings, addLuckyWheelPrize, updateLuckyWheelPrize, deleteLuckyWheelPrize
    } = useStore();
    const [mounted, setMounted] = useState(false);
    const [lastCount, setLastCount] = useState(0);
    const [activeTab, setActiveTab] = useState('orders'); // orders, menu, vouchers, reports, chat
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        setMounted(true);
        setLastCount(orders.length);
    }, []);

    useEffect(() => {
        if (mounted && orders.length > lastCount) {
            document.title = '(1) Đơn hàng mới! - Snacky Admin';
            const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
            audio.play().catch(e => console.log('Audio blocked, user needs to interact first'));
            setTimeout(() => document.title = 'Snacky Admin', 5000);
            setLastCount(orders.length);
        }
    }, [orders.length, mounted, lastCount]);

    const StatusIcon = ({ status }) => {
        if (status === 'pending') return <AlertCircle className="pulse-badge" style={{ position: 'relative' }} size={20} color="#df8500" />;
        if (status === 'preparing') return <ChefHat size={20} color="var(--primary-color)" />;
        if (status === 'delivering') return <Truck size={20} color="#3b82f6" />;
        if (status === 'completed') return <CheckCircle size={20} color="var(--success)" />;
        return <Clock size={20} />;
    };

    const StatusText = ({ status }) => {
        if (status === 'pending') return <span className="badge badge-pending">Chờ nhận</span>;
        if (status === 'preparing') return <span className="badge badge-preparing">Đang làm</span>;
        if (status === 'delivering') return <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>Đang giao</span>;
        if (status === 'completed') return <span className="badge badge-completed">Hoàn thành</span>;
        return null;
    };

    // Live Orders
    const renderOrders = () => {
        const liveOrders = orders.filter(o => o.status !== 'completed');
        return (
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div className="order-row" style={{ background: 'var(--surface-color)', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    <div>Thông tin khách</div>
                    <div>Món ăn</div>
                    <div>Tổng tiền</div>
                    <div>Trạng thái</div>
                    <div>Thao tác</div>
                </div>

                {liveOrders.length === 0 ? (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ChefHat size={64} style={{ opacity: 0.1, marginBottom: '1rem', margin: '0 auto' }} />
                        <p style={{ fontSize: '1.2rem' }}>Hiện chưa có đơn mới. Bạn có thể nghỉ ngơi nhé!</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {liveOrders.map((order) => (
                            <div key={order.id} className="order-row animate-fade-in" style={{
                                background: order.status === 'pending' ? 'rgba(255, 152, 0, 0.05)' : 'white'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{order.tableId}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>ID: #{order.id}</div>
                                    <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                                    {order.phone && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Phone size={14} /> {order.phone}</div>}
                                    {order.address && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '4px' }}><MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{order.address}</span></div>}
                                    {order.note && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', marginTop: '6px', background: 'rgba(239,68,68,0.05)', padding: '4px 8px', borderRadius: '4px', borderLeft: '2px solid var(--danger)' }}><i>"{order.note}"</i></div>}
                                </div>

                                <div>
                                    {order.items.map(item => (
                                        <div key={item.cartItemId} style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{item.quantity}x</span>
                                                <div>
                                                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                                                    {item.optionsText && (
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>+{item.optionsText}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="food-price">
                                    {formatPrice(order.total)}
                                    {order.discount > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'normal' }}>Đã giảm: {formatPrice(order.discount)}</div>}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <StatusIcon status={order.status} />
                                    <StatusText status={order.status} />
                                </div>

                                <div>
                                    {order.status === 'pending' && (
                                        <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', width: '100%' }} onClick={() => updateOrderStatus(order.id, 'preparing')}>
                                            Nhận đơn ngay
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button className="btn" style={{ padding: '0.6rem 1.25rem', width: '100%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6' }} onClick={() => updateOrderStatus(order.id, 'delivering')}>
                                            <Truck size={18} /> Giao hàng
                                        </button>
                                    )}
                                    {order.status === 'delivering' && (
                                        <button className="btn" style={{ padding: '0.6rem 1.25rem', width: '100%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' }} onClick={() => updateOrderStatus(order.id, 'completed')}>
                                            <CheckCircle size={18} /> Giao xong
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Menu Management
    const renderMenuManager = () => {
        return (
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>Quản lý Thực đơn</h2>
                    <button className="btn btn-primary" onClick={() => {
                        const name = prompt('Nhập tên món ăn mới:');
                        if (!name) return;
                        const price = parseInt(prompt('Nhập giá món ăn (VND):') || '0');
                        const categoryOpts = categories.map(c => c.id).join(', ');
                        const category = prompt(`Nhập ID danh mục (${categoryOpts}):`) || 'an_vat';
                        const description = prompt('Nhập mô tả món (tuỳ chọn):') || '';
                        const image = prompt('Nhập link hình ảnh (tuỳ chọn):') || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';

                        addMenuItem({ name, price, category, description, image, options: [], soldOut: false });
                    }}>
                        <Plus size={18} /> Thêm món mới
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {menuItems.map(item => (
                        <div key={item.id} className="flex-between" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'white' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', opacity: item.soldOut ? 0.5 : 1 }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: item.soldOut ? 'line-through' : 'none' }}>{item.name}</div>
                                    <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatPrice(item.price)}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Danh mục: {categories.find(c => c.id === item.category)?.name || item.category}
                                    </div>
                                    {item.soldOut && <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 'bold', marginTop: '2px' }}>[Đã hết hàng]</div>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn" style={{ padding: '0.5rem 1rem', background: item.soldOut ? 'var(--success)' : 'var(--border-color)', color: item.soldOut ? 'white' : 'var(--text-main)', border: 'none' }} onClick={() => {
                                    updateMenuItem(item.id, { soldOut: !item.soldOut });
                                }}>
                                    {item.soldOut ? 'Mở bán lại' : 'Báo hết hàng'}
                                </button>
                                <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', border: 'none' }} onClick={() => {
                                    if (window.confirm(`Xoá món ${item.name}?`)) deleteMenuItem(item.id);
                                }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Analytics calculations
    const stats = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === 'completed');
        const todayStr = new Date().toLocaleDateString('vi-VN');

        const todayOrders = completedOrders.filter(o => new Date(o.createdAt).toLocaleDateString('vi-VN') === todayStr);
        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

        // Top selling items
        const itemCounts = {};
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const key = item.name;
                itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Revenue by category
        const categoryStats = {};
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const cat = item.category || 'an_vat';
                const catName = categories.find(c => c.id === cat)?.name || cat;
                if (!categoryStats[catName]) categoryStats[catName] = 0;
                categoryStats[catName] += item.finalPrice * item.quantity;
            });
        });

        return {
            todayRevenue,
            todayCount: todayOrders.length,
            totalRevenue,
            totalCount: completedOrders.length,
            topItems,
            categoryStats,
            completedOrders: completedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        };
    }, [orders]);

    const renderReports = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #FF9800, #F44336)', color: 'white' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '500' }}>DOANH THU HÔM NAY</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{formatPrice(stats.todayRevenue)}</div>
                        <div style={{ fontSize: '0.85rem' }}>{stats.todayCount} đơn thành công</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: 'white' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '500' }}>TỔNG DOANH THU</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{formatPrice(stats.totalRevenue)}</div>
                        <div style={{ fontSize: '0.85rem' }}>{stats.totalCount} đơn từ trước tới nay</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #2196F3, #1565C0)', color: 'white' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '500' }}>GIÁ TRỊ TB ĐƠN</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                            {formatPrice(stats.totalCount ? Math.floor(stats.totalRevenue / stats.totalCount) : 0)}
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>Dựa trên tất cả đơn hàng</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {/* Top Items */}
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BarChart2 size={20} color="var(--primary-color)" /> Món Bán Chạy Nhất
                        </h3>
                        {stats.topItems.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu bán hàng.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stats.topItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--primary-color)' }}>#{idx + 1}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', marginBottom: '0.3rem' }}>{item.name}</div>
                                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    background: 'var(--primary-color)',
                                                    width: `${(item.count / stats.topItems[0].count) * 100}%`,
                                                    borderRadius: '4px'
                                                }}></div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', minWidth: '40px', textAlign: 'right' }}>{item.count}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Distribution */}
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Store size={20} color="var(--secondary-color)" /> Doanh Thu Theo Danh Mục
                        </h3>
                        {Object.keys(stats.categoryStats).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {Object.entries(stats.categoryStats).map(([cat, amount]) => (
                                    <div key={cat} className="flex-between" style={{ padding: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ fontWeight: '500' }}>{cat}</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formatPrice(amount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed History */}
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Lịch Sử Giao Hàng Chi Tiết</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '1rem 0.5rem' }}>Thời gian</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Khách hàng</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Bàn/Địa chỉ</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Tổng tiền</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Giảm giá</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.completedOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{order.customerName}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <div>{order.tableId}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.address}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{formatPrice(order.subtotal)}</td>
                                        <td style={{ padding: '1rem 0.5rem', color: 'var(--danger)' }}>-{formatPrice(order.discount)}</td>
                                        <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{formatPrice(order.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {stats.completedOrders.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có đơn hàng nào hoàn thành.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Lucky Wheel Management
    const renderLuckyWheelManager = () => {
        return (
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Cài đặt Vòng Quay May Mắn</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Trạng thái vòng quay</label>
                            <button
                                className="btn"
                                style={{
                                    background: luckyWheelSettings.isActive ? 'var(--success)' : 'var(--danger)',
                                    color: 'white', width: '100%', border: 'none'
                                }}
                                onClick={() => updateLuckyWheelSettings({ isActive: !luckyWheelSettings.isActive })}
                            >
                                {luckyWheelSettings.isActive ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                            </button>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Giá trị đơn tối thiểu (VND)</label>
                            <input
                                type="number"
                                className="btn"
                                style={{ background: 'white', width: '100%', textAlign: 'left', border: '1px solid var(--border-color)' }}
                                value={luckyWheelSettings.minOrderValue}
                                onChange={(e) => updateLuckyWheelSettings({ minOrderValue: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Danh sách giải thưởng</h3>
                        <button className="btn btn-primary" onClick={() => {
                            const label = prompt('Tên giải thưởng (VD: Giảm 20k):');
                            if (!label) return;
                            const type = prompt('Loại (discount/gift):') || 'gift';
                            const value = type === 'discount' ? parseInt(prompt('Giá trị giảm (VND):') || '0') : prompt('Tên món quà:');
                            const probability = parseInt(prompt('Tỷ lệ lệ xuất hiện (0-100%):') || '0');
                            const color = prompt('Mã màu (Hex):') || '#3b82f6';

                            addLuckyWheelPrize({ label, type, value, probability, color });
                        }}>
                            <Plus size={18} /> Thêm giải thưởng
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Màu</th>
                                    <th style={{ padding: '1rem' }}>Tên giải thưởng</th>
                                    <th style={{ padding: '1rem' }}>Loại</th>
                                    <th style={{ padding: '1rem' }}>Giá trị</th>
                                    <th style={{ padding: '1rem' }}>Tỷ lệ (%)</th>
                                    <th style={{ padding: '1rem' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {luckyWheelSettings.prizes.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: p.color, border: '1px solid #ddd' }}></div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.label}</td>
                                        <td style={{ padding: '1rem' }}>{p.type === 'discount' ? 'Giảm tiền' : 'Quà tặng'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {p.type === 'discount' ? formatPrice(p.value) : p.value}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    style={{ width: '60px', padding: '4px', border: '1px solid var(--border-color)' }}
                                                    value={p.probability}
                                                    onChange={(e) => updateLuckyWheelPrize(p.id, { probability: parseInt(e.target.value) || 0 })}
                                                />
                                                <span>%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => {
                                                if (confirm('Xoá giải thưởng này?')) deleteLuckyWheelPrize(p.id);
                                            }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Chat Management
    const renderChatManager = () => {
        // Group messages by customer (using phone as unique ID)
        const customers = {};
        messages.forEach(msg => {
            if (msg.customerPhone) {
                if (!customers[msg.customerPhone]) {
                    customers[msg.customerPhone] = {
                        name: msg.customerName || 'Khách ẩn danh',
                        phone: msg.customerPhone,
                        lastMessage: msg,
                        unread: 0 // In a real app, we'd track unread status
                    };
                }
                if (new Date(msg.timestamp) > new Date(customers[msg.customerPhone].lastMessage.timestamp)) {
                    customers[msg.customerPhone].lastMessage = msg;
                }
            }
        });

        const customerList = Object.values(customers).sort((a, b) =>
            new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );

        const currentChatMessages = selectedCustomer
            ? messages.filter(m => m.customerPhone === selectedCustomer.phone)
            : [];

        return (
            <div className="glass-panel" style={{ display: 'flex', height: '70vh', overflow: 'hidden', padding: 0 }}>
                {/* Customer List */}
                <div style={{ width: '350px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={20} color="var(--primary-color)" /> Hội thoại
                        </h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {customerList.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có tin nhắn nào.</div>
                        ) : (
                            customerList.map(c => (
                                <div
                                    key={c.phone}
                                    onClick={() => setSelectedCustomer(c)}
                                    style={{
                                        padding: '1.2rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        background: selectedCustomer?.phone === c.phone ? 'white' : 'transparent',
                                        borderLeft: selectedCustomer?.phone === c.phone ? '4px solid var(--primary-color)' : '4px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{c.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                                            {new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {c.lastMessage.role === 'owner' ? 'Bạn: ' : ''}{c.lastMessage.text}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '4px', fontWeight: '500' }}>{c.phone}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                    {selectedCustomer ? (
                        <>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedCustomer.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SĐT: {selectedCustomer.phone}</div>
                                </div>
                                <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => setSelectedCustomer(null)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f1f5f9' }}>
                                {currentChatMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            alignSelf: msg.role === 'owner' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            background: msg.role === 'owner' ? 'var(--primary-color)' : 'white',
                                            color: msg.role === 'owner' ? 'white' : 'var(--text-main)',
                                            padding: '0.8rem 1rem',
                                            borderRadius: msg.role === 'owner' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '1.2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.8rem' }}>
                                <input
                                    type="text"
                                    placeholder="Nhấn Enter để gửi phản hồi..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && replyText.trim()) {
                                            addMessage({
                                                role: 'owner',
                                                text: replyText,
                                                customerPhone: selectedCustomer.phone,
                                                customerName: selectedCustomer.name
                                            });
                                            setReplyText('');
                                        }
                                    }}
                                    style={{ flex: 1, padding: '0.8rem 1.25rem', borderRadius: '100px', border: '1px solid var(--border-color)', outline: 'none' }}
                                />
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => {
                                        if (replyText.trim()) {
                                            addMessage({
                                                role: 'owner',
                                                text: replyText,
                                                customerPhone: selectedCustomer.phone,
                                                customerName: selectedCustomer.name
                                            });
                                            setReplyText('');
                                        }
                                    }}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <MessageSquare size={64} style={{ opacity: 0.2 }} />
                            </div>
                            <p style={{ fontSize: '1.2rem' }}>Chọn một hội thoại để bắt đầu hỗ trợ khách hàng</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const pendingCount = orders.filter(o => o.status === 'pending').length;

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <header className="flex-between" style={{ marginBottom: '2rem', padding: '1rem 2rem', background: 'var(--surface-color)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Tổng Đài Quản Lý</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Hệ thống quản lý nhà hàng tự động</p>
                </div>
                <button className="btn" style={{ border: 'none', background: 'rgba(255, 152, 0, 0.1)', color: 'var(--primary-color)' }} onClick={() => window.location.reload()}>
                    <RefreshCw size={18} /> Đồng bộ mới
                </button>
            </header>

            <div className="tabs">
                <div className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <ListOrdered size={20} /> Đơn hàng
                    {pendingCount > 0 && <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{pendingCount}</span>}
                </div>
                <div className={`tab ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Store size={20} /> Thực đơn
                </div>
                <div className={`tab ${activeTab === 'vouchers' ? 'active' : ''}`} onClick={() => setActiveTab('vouchers')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Tag size={20} /> Khuyến mãi
                </div>
                <div className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <BarChart2 size={20} /> Lịch sử đơn
                </div>
                <div className={`tab ${activeTab === 'wheel' ? 'active' : ''}`} onClick={() => setActiveTab('wheel')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Gift size={20} /> Vòng quay
                </div>
                <div className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <MessageSquare size={20} /> Hỗ trợ khách
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'menu' && renderMenuManager()}
                {activeTab === 'vouchers' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>Quản lý Voucher Khuyến Mãi</h2>
                            <button className="btn btn-primary" onClick={() => {
                                const code = prompt('Nhập mã voucher (VD: SNACKYVIP):')?.toUpperCase();
                                if (!code) return;
                                const discount = parseInt(prompt(`Nhập số tiền giảm cho mã ${code} (VND):`) || '0');
                                if (discount > 0) {
                                    addVoucher({ code, discount });
                                }
                            }}>
                                <Plus size={18} /> Thêm Voucher
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {vouchers?.map(voucher => (
                                <div key={voucher.id} className="flex-between" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'white', opacity: voucher.isActive ? 1 : 0.6 }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Tag size={18} /> {voucher.code}
                                        </div>
                                        <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Giảm: <span style={{ fontWeight: 'bold' }}>{formatPrice(voucher.discount)}</span></div>
                                        {!voucher.isActive && <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.5rem', fontWeight: 'bold' }}>[Đang khoá]</div>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn" style={{ padding: '0.6rem 1rem', background: voucher.isActive ? 'var(--danger)' : 'var(--success)', color: 'white', border: 'none' }} onClick={() => {
                                            updateVoucher(voucher.id, { isActive: !voucher.isActive });
                                        }}>
                                            {voucher.isActive ? 'Khóa mã' : 'Mở lại mã'}
                                        </button>
                                        <button className="btn" style={{ padding: '0.6rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', border: 'none' }} onClick={() => {
                                            if (window.confirm(`Xoá vĩnh viễn voucher ${voucher.code}?`)) deleteVoucher(voucher.id);
                                        }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!vouchers || vouchers.length === 0) && (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Chưa có mã khuyến mãi nào được tạo.</p>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'reports' && renderReports()}
                {activeTab === 'wheel' && renderLuckyWheelManager()}
                {activeTab === 'chat' && renderChatManager()}
            </div>
        </div>
    );
}
