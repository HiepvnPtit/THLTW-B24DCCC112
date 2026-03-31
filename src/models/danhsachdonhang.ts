import { useCallback, useEffect, useState } from 'react';

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    products: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const STORAGE_KEY = 'danhSachDonHang';
const calculateTotal = (products: OrderItem[]): number => {
    return (products || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
};
const DEFAULT_DATA: Order[] = [
    {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
        totalAmount: 25000000,
        status: 'Chờ xử lý',
        createdAt: '2024-01-15',
    },
];

export default () => {
    const [danhSachDonHang, setDanhSachDonHang] = useState<Order[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return DEFAULT_DATA;
            }
        }
        return DEFAULT_DATA;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachDonHang));
    }, [danhSachDonHang]);

    const addDonHang = useCallback((item: Omit<Order, 'id'>) => {
        setDanhSachDonHang((prev) => {
            const lastIdNum = prev.reduce((max, order) => {
                const num = parseInt(order.id.replace(/\D/g, ''), 10);
                return !isNaN(num) ? Math.max(max, num) : max;
            }, 0);
            const totalAmount = calculateTotal(item.products);
            const newId = `DH${(lastIdNum + 1).toString().padStart(3, '0')}`;
            const newItem = { ...item, id: newId, totalAmount };
            return [...prev, newItem];
        });
    }, []);

    const updateDonHang = useCallback((id: string, updatedOrder: Partial<Order>) => {
        setDanhSachDonHang((prev) =>

            prev.map((item) => {
                if (item.id === id) {
                    const updatedProducts = updatedOrder.products || item.products;
                    const totalAmount = calculateTotal(updatedProducts);
                    return { ...item, ...updatedOrder, totalAmount };
                }
                return item;
            }),
        );
    }, []);

    const deleteDonHang = useCallback((id: string) => {
        setDanhSachDonHang((prev) => prev.filter((item) => item.id !== id));
    }, []);

    return {
        danhSachDonHang,
        setDanhSachDonHang,
        addDonHang,
        updateDonHang,
        deleteDonHang,
    };
};