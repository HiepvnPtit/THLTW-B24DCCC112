import { useCallback, useEffect, useState } from 'react';

export interface MonHoc {
    id: number;
    name: string;
    soTinChi?: number;
}

export interface TienDoMonHoc {
    id: number;
    monHocId: number;
    timeLine: string[];
    content: string;
    note: string;
}

export interface MucTieuMonHoc {
    id: number;
    monHocId: number;
    mucTieu: string;
    trangThai: string;
}

export interface DanhKhoiKienThuc {
    id: number;
    khoiKienThuc: string;
}

export interface DanhMucCauHoi {
    id: number;
    cauHoi: string;
    monHocId: number;
    doKho: string;
    khoiKienThucId: number;
}

export interface TaoDeThiItem {
    id: number;
    tenDe: string;
    monHocId: number;
    soCau: number;
    khoiKienThucId: number;
    danhsachCauHoiId: number[];
}

const STORAGE_KEY = 'danhMucMonHoc';
const TIEN_DO_KEY = 'tienDoMonHoc';
const MUC_TIEU_KEY = 'mucTieuMonHoc';
const TAO_DE_THI_KEY = 'taoDeThi';
const DEFAULT_DATA: MonHoc[] = [
    { id: 1, name: 'Toán', soTinChi: 3 },
    { id: 2, name: 'Văn', soTinChi: 2 },
    { id: 3, name: 'Anh', soTinChi: 2 },
    { id: 4, name: 'Lý', soTinChi: 3 },
    { id: 9, name: 'Khoa học', soTinChi: 2 },
];

const DEFAULT_KHOI_KIEN_THUC: DanhKhoiKienThuc[] = [
    { id: 1, khoiKienThuc: 'Tổng quan' },
    { id: 2, khoiKienThuc: 'Chuyên sâu' },
    { id: 3, khoiKienThuc: 'Ứng dụng' },
];

const DEFAULT_CAU_HOI: DanhMucCauHoi[] = [
    { id: 1, cauHoi: 'Câu hỏi 1 2=x', monHocId: 1, doKho: 'Dễ', khoiKienThucId: 1 },
    { id: 2, cauHoi: 'Câu hỏi 2 2=2', monHocId: 1, doKho: 'Trung bình', khoiKienThucId: 2 },
    { id: 3, cauHoi: 'Câu hỏi 3 2+2', monHocId: 2, doKho: 'Khó', khoiKienThucId: 3 },
    { id: 4, cauHoi: 'Câu hỏi 4 dádass', monHocId: 3, doKho: 'Dễ', khoiKienThucId: 1 },
    { id: 5, cauHoi: 'Câu hỏi 5', monHocId: 4, doKho: 'Trung bình', khoiKienThucId: 2 },
    { id: 6, cauHoi: 'Câu hỏi 6', monHocId: 9, doKho: 'Khó', khoiKienThucId: 3 },
    { id: 7, cauHoi: 'Câu hỏi 7', monHocId: 1, doKho: 'Dễ', khoiKienThucId: 1 },
    { id: 8, cauHoi: 'Câu hỏi 8', monHocId: 2, doKho: 'Trung bình', khoiKienThucId: 2 },
    { id: 9, cauHoi: 'Câu hỏi 9', monHocId: 3, doKho: 'Khó', khoiKienThucId: 3 },
    { id: 10, cauHoi: 'Câu hỏi 10', monHocId: 4, doKho: 'Dễ', khoiKienThucId: 1 },
];



export default () => {

    const getSafeData = (key: string, defaultValue: any) => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : defaultValue;
            }
        } catch (e) {
            console.error(`Lỗi đọc dữ liệu từ ${key}:`, e);
        }
        return defaultValue;
    };

    const [danhMucMonHoc, setDanhMucMonHoc] = useState<MonHoc[]>(() =>
        getSafeData(STORAGE_KEY, DEFAULT_DATA)
    );
    const [tienDoMonHoc, setTienDoMonHoc] = useState<TienDoMonHoc[]>(() =>
        getSafeData(TIEN_DO_KEY, [])
    );
    const [mucTieuMonHoc, setMucTieuMonHoc] = useState<MucTieuMonHoc[]>(() =>
        getSafeData(MUC_TIEU_KEY, [])
    );
    const [danhKhoiKienThuc, setDanhKhoiKienThuc] = useState<DanhKhoiKienThuc[]>(() =>
        getSafeData('danhKhoiKienThuc', DEFAULT_KHOI_KIEN_THUC)
    );
    const [danhMucCauHoi, setDanhMucCauHoi] = useState<DanhMucCauHoi[]>(() =>
        getSafeData('danhMucCauHoi', DEFAULT_CAU_HOI)
    );
    const [taoDeThi, setTaoDeThi] = useState<TaoDeThiItem[]>(() =>
        getSafeData(TAO_DE_THI_KEY, [])
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(danhMucMonHoc));
    }, [danhMucMonHoc]);

    useEffect(() => {
        localStorage.setItem(TIEN_DO_KEY, JSON.stringify(tienDoMonHoc));
    }, [tienDoMonHoc]);

    useEffect(() => {
        localStorage.setItem(MUC_TIEU_KEY, JSON.stringify(mucTieuMonHoc));
    }, [mucTieuMonHoc]);

    useEffect(() => {
        localStorage.setItem('danhKhoiKienThuc', JSON.stringify(danhKhoiKienThuc));
    }, [danhKhoiKienThuc]);

    useEffect(() => {
        localStorage.setItem('danhMucCauHoi', JSON.stringify(danhMucCauHoi));
    }, [danhMucCauHoi]);

    useEffect(() => {
        localStorage.setItem(TAO_DE_THI_KEY, JSON.stringify(taoDeThi));
    }, [taoDeThi]);

    const addMonHoc = useCallback((item: Omit<MonHoc, 'id'>) => {
        setDanhMucMonHoc((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
            const newMonHoc = { id: maxId + 1, ...item };
            return [...prev, newMonHoc];
        });
    }, []);
    const addTienDoMonHoc = useCallback((item: Omit<TienDoMonHoc, 'id'>) => {
        setTienDoMonHoc((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((t) => t.id)) : 0;

            const newTienDo = {
                ...item,
                id: maxId + 1
            };
            return [...prev, newTienDo];
        });
    }, []);

    const addMucTieuMonHoc = useCallback((monHocId: number, mucTieu: string, trangThai: string) => {
        setMucTieuMonHoc((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
            const newMucTieu = { id: maxId + 1, monHocId, mucTieu, trangThai };
            return [...prev, newMucTieu];
        });
    }, []);

    const addDanhKhoiKienThuc = useCallback((khoiKienThuc: string) => {
        setDanhKhoiKienThuc((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((k) => k.id)) : 0;
            const newKhoi = { id: maxId + 1, khoiKienThuc };
            return [...prev, newKhoi];
        });
    }, []);

    const addDanhMucCauHoi = useCallback((monHocId: number, cauHoi: string, doKho: string, khoiKienThucId: number) => {
        setDanhMucCauHoi((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) : 0;
            const newCauHoi = { id: maxId + 1, monHocId: monHocId, cauHoi, doKho, khoiKienThucId };
            return [...prev, newCauHoi];
        });
    }, []);

    const addTaoDeThi = useCallback((tenDe: string, monHocId: number, soCau: number, khoiKienThucId: number, danhsachCauHoiId: number[]) => {
        setTaoDeThi((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((d) => d.id)) : 0;
            const newDeThi = { id: maxId + 1, tenDe, monHocId, soCau, khoiKienThucId, danhsachCauHoiId };
            return [...prev, newDeThi];
        });
    }, []);

    const updateMonHoc = useCallback((id: number,
        data: Partial<MonHoc>) => {
        setDanhMucMonHoc((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const updateTienDoMonHoc = useCallback((id:
        number, data: Partial<TienDoMonHoc>) => {
        setTienDoMonHoc((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const updateMucTieuMonHoc = useCallback((id: number, data: Partial<MucTieuMonHoc>) => {
        setMucTieuMonHoc((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const updateDanhKhoiKienThuc = useCallback((id: number, data: Partial<DanhKhoiKienThuc>) => {
        setDanhKhoiKienThuc((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const updateDanhMucCauHoi = useCallback((id: number, data: Partial<DanhMucCauHoi>) => {
        setDanhMucCauHoi((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const updateTaoDeThi = useCallback((id: number, data: Partial<TaoDeThiItem>) => {
        setTaoDeThi((prev) => prev.map(item => item.id === id ? { ...item, ...data } : item));
    }, []);

    const deleteMonHoc = useCallback((id: number) => {
        setDanhMucMonHoc((prev) => prev.filter(item => item.id !== id));
        setTienDoMonHoc((prev) => prev.filter(item => item.monHocId !== id));
        setMucTieuMonHoc((prev) => prev.filter(item => item.monHocId !== id));
    }, []);

    const deleteMucTieuMonHoc = useCallback((id: number) => {
        setMucTieuMonHoc((prev) => prev.filter(item => item.id !== id));
    }, []);

    const deleteTienDoMonHoc = useCallback((id: number) => {
        setTienDoMonHoc((prev) => prev.filter(item => item.id !== id));
    }, []);

    const deleteDanhKhoiKienThuc = useCallback((id: number) => {
        setDanhKhoiKienThuc((prev) => prev.filter(item => item.id !== id));
    }, []);

    const deleteDanhMucCauHoi = useCallback((id: number) => {
        setDanhMucCauHoi((prev) => prev.filter(item => item.id !== id));
    }, []);

    const deleteTaoDeThi = useCallback((id: number) => {
        setTaoDeThi((prev) => prev.filter(item => item.id !== id));
    }, []);

    return {
        danhMucMonHoc,
        setDanhMucMonHoc,
        addMonHoc,
        updateMonHoc,
        deleteMonHoc,
        tienDoMonHoc,
        setTienDoMonHoc,
        addTienDoMonHoc,
        updateTienDoMonHoc,
        deleteTienDoMonHoc,
        mucTieuMonHoc,
        setMucTieuMonHoc,
        addMucTieuMonHoc,
        updateMucTieuMonHoc,
        deleteMucTieuMonHoc,
        danhKhoiKienThuc,
        setDanhKhoiKienThuc,
        addDanhKhoiKienThuc,
        updateDanhKhoiKienThuc,
        deleteDanhKhoiKienThuc,
        danhMucCauHoi,
        setDanhMucCauHoi,
        addDanhMucCauHoi,
        updateDanhMucCauHoi,
        deleteDanhMucCauHoi,
        taoDeThi,
        setTaoDeThi,
        addTaoDeThi,
        updateTaoDeThi,
        deleteTaoDeThi,

    };
};