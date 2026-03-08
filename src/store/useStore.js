import { create } from 'zustand';
import { initialMenu } from '../data/menu';

const channel = new BroadcastChannel('snacky_orders_channel');

export const useStore = create((set, get) => {
    channel.onmessage = (event) => {
        if (event.data.type === 'SYNC') {
            set(event.data.payload);
        }
    };

    const syncState = (partialState) => {
        set(partialState);
        const currentState = get();
        localStorage.setItem('snacky_data', JSON.stringify({
            orders: currentState.orders,
            menuItems: currentState.menuItems,
            vouchers: currentState.vouchers,
            messages: currentState.messages,
            luckyWheelSettings: currentState.luckyWheelSettings
        }));
        channel.postMessage({ type: 'SYNC', payload: partialState });
    };

    const savedData = JSON.parse(localStorage.getItem('snacky_data') || '{}');

    // Merge new items from initialMenu that aren't in savedData
    let currentMenuItems = savedData.menuItems || initialMenu;
    if (savedData.menuItems) {
        const existingIds = new Set(savedData.menuItems.map(item => item.id));
        const newItemsToAdd = initialMenu.filter(item => !existingIds.has(item.id));
        if (newItemsToAdd.length > 0) {
            currentMenuItems = [...savedData.menuItems, ...newItemsToAdd];
        }
    }

    return {
        cart: [],
        orders: savedData.orders || [],
        menuItems: currentMenuItems,
        vouchers: savedData.vouchers || [
            { id: '1', code: 'SNACKYVIP', discount: 10000, isActive: true }
        ],
        messages: savedData.messages || [],
        luckyWheelSettings: savedData.luckyWheelSettings || {
            isActive: true,
            minOrderValue: 100000,
            prizes: [
                { id: '1', label: 'Giảm 5k', type: 'discount', value: 5000, probability: 40, color: '#FFD700' },
                { id: '2', label: 'Giảm 10k', type: 'discount', value: 10000, probability: 20, color: '#FF8C00' },
                { id: '3', label: 'Free Trà Chanh', type: 'gift', value: 'Trà Chanh', probability: 15, color: '#ADFF2F' },
                { id: '4', label: 'Chúc bạn may mắn', type: 'gift', value: 'None', probability: 25, color: '#C0C0C0' }
            ]
        },

        addMessage: (msg) => {
            const { messages } = get();
            const newMessage = {
                ...msg,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            };
            const newMessages = [...messages, newMessage];
            syncState({ messages: newMessages });

            // Auto-reply simulation from owner
            if (msg.role === 'customer') {
                setTimeout(() => {
                    const currentMessages = get().messages;
                    const reply = {
                        id: Math.random().toString(36).substr(2, 9),
                        role: 'owner',
                        text: `Chào ${msg.customerName || 'bạn'}! Snacky đã nhận được tin nhắn. Đợi chút mình kiểm tra rồi báo lại ngay nha! 🍟✨`,
                        customerName: msg.customerName,
                        customerPhone: msg.customerPhone,
                        timestamp: new Date().toISOString()
                    };
                    syncState({ messages: [...currentMessages, reply] });
                }, 1500);
            }
        },

        addToCart: (item, selectedOptions = {}) => {
            const { cart } = get();

            let extraPrice = 0;
            let optionsText = [];
            const optionHashObj = {};

            Object.keys(selectedOptions).forEach(optId => {
                const optionData = item.options?.find(o => o.id === optId);
                if (optionData) {
                    if (optionData.type === 'single') {
                        const choiceName = selectedOptions[optId];
                        const choice = optionData.choices.find(c => c.name === choiceName);
                        if (choice) {
                            extraPrice += choice.price;
                            optionsText.push(`${choice.name}`);
                            optionHashObj[optId] = choice.name;
                        }
                    } else if (optionData.type === 'multiple') {
                        const selectedChoices = selectedOptions[optId];
                        const validChoices = [];
                        selectedChoices.forEach(choiceName => {
                            const choice = optionData.choices.find(c => c.name === choiceName);
                            if (choice) {
                                extraPrice += choice.price;
                                optionsText.push(`${choice.name}`);
                                validChoices.push(choice.name);
                            }
                        });
                        optionHashObj[optId] = validChoices.sort();
                    }
                }
            });

            const finalPrice = item.price + extraPrice;
            const cartItemId = `${item.id}-${JSON.stringify(optionHashObj)}`;

            const existing = cart.find(i => i.cartItemId === cartItemId);
            if (existing) {
                set({ cart: cart.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i) });
            } else {
                set({
                    cart: [...cart, {
                        ...item,
                        cartItemId,
                        quantity: 1,
                        finalPrice,
                        optionsText: optionsText.join(', ')
                    }]
                });
            }
        },

        removeFromCart: (cartItemId) => set((state) => ({
            cart: state.cart.filter(i => i.cartItemId !== cartItemId)
        })),

        updateQuantity: (cartItemId, amount) => set((state) => ({
            cart: state.cart.map(i => {
                if (i.cartItemId === cartItemId) {
                    const newQty = i.quantity + amount;
                    return newQty > 0 ? { ...i, quantity: newQty } : i;
                }
                return i;
            })
        })),

        clearCart: () => set({ cart: [] }),

        placeOrder: (tableId, customerName, phone, address, note, discount = 0) => {
            const { cart, orders } = get();
            if (cart.length === 0) return null;

            const subtotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
            const total = Math.max(0, subtotal - discount);

            const newOrder = {
                id: Math.random().toString(36).substr(2, 9),
                tableId: tableId || 'Mang Đi',
                customerName: customerName || 'Khách',
                phone: phone || '',
                address: address || '',
                note: note || '',
                items: [...cart],
                subtotal: subtotal,
                discount: discount,
                total: total,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const newOrders = [newOrder, ...orders];
            syncState({ orders: newOrders });
            set({ cart: [] });
            return newOrder;
        },

        updateOrderStatus: (orderId, newStatus) => {
            const { orders } = get();
            const newOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
            syncState({ orders: newOrders });
        },

        addMenuItem: (item) => {
            const { menuItems } = get();
            const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), options: item.options || [] };
            syncState({ menuItems: [...menuItems, newItem] });
        },

        updateMenuItem: (itemId, updatedItem) => {
            const { menuItems } = get();
            syncState({ menuItems: menuItems.map(item => item.id === itemId ? { ...item, ...updatedItem } : item) });
        },

        deleteMenuItem: (itemId) => {
            const { menuItems } = get();
            syncState({ menuItems: menuItems.filter(item => item.id !== itemId) });
        },

        addVoucher: (voucher) => {
            const { vouchers } = get();
            const newVoucher = { ...voucher, id: Math.random().toString(36).substr(2, 9), isActive: true };
            syncState({ vouchers: [...vouchers, newVoucher] });
        },

        updateVoucher: (voucherId, updatedVoucher) => {
            const { vouchers } = get();
            syncState({ vouchers: vouchers.map(v => v.id === voucherId ? { ...v, ...updatedVoucher } : v) });
        },

        deleteVoucher: (voucherId) => {
            const { vouchers } = get();
            syncState({ vouchers: vouchers.filter(v => v.id !== voucherId) });
        },

        updateLuckyWheelSettings: (settings) => {
            const { luckyWheelSettings } = get();
            syncState({ luckyWheelSettings: { ...luckyWheelSettings, ...settings } });
        },

        addLuckyWheelPrize: (prize) => {
            const { luckyWheelSettings } = get();
            const newPrize = { ...prize, id: Math.random().toString(36).substr(2, 9) };
            syncState({
                luckyWheelSettings: {
                    ...luckyWheelSettings,
                    prizes: [...luckyWheelSettings.prizes, newPrize]
                }
            });
        },

        updateLuckyWheelPrize: (prizeId, updatedPrize) => {
            const { luckyWheelSettings } = get();
            syncState({
                luckyWheelSettings: {
                    ...luckyWheelSettings,
                    prizes: luckyWheelSettings.prizes.map(p => p.id === prizeId ? { ...p, ...updatedPrize } : p)
                }
            });
        },

        deleteLuckyWheelPrize: (prizeId) => {
            const { luckyWheelSettings } = get();
            syncState({
                luckyWheelSettings: {
                    ...luckyWheelSettings,
                    prizes: luckyWheelSettings.prizes.filter(p => p.id !== prizeId)
                }
            });
        }
    };
});
