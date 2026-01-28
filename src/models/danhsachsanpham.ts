import { SigninRedirectArgs } from 'oidc-client-ts';
import { useCallback, useEffect, useState } from 'react';
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}


const DEFAULT_DATA: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
    { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
    { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
    { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const STORAGE_KEY = 'danhSachSanPham';


export default () => {
    const [danhSachSanPham, setDanhSachSanPham] = useState<Product[]>(() => {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachSanPham));
    }, [danhSachSanPham]);
    const addSanPham = useCallback((item: Omit<Product, 'id'>) => {
        setDanhSachSanPham((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            const newItem = { ...item, id: maxId + 1 };
            return [...prev, newItem];
        });
    }, []);
    const deleteSanPham = useCallback((id: number) => {
        setDanhSachSanPham((prev) => prev.filter(item => item.id !== id));
    }, []);

    return {
        danhSachSanPham,
        setDanhSachSanPham,
        addSanPham,
        deleteSanPham
    };
}