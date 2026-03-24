import { useCallback, useEffect, useState } from 'react';

export interface DichVuCaToc {
    id: number;
    tenDichVu: string;
    giaTien: number;
    thoiGianThucHien: number | string;
    moTa: string;
}

export interface NhanVienThucHien {
    id: number;
    tenNhanVien: string;
    sdt: string;
    gioiHanKhachHang: number;
}

export interface LichLamViec {
    id: number;
    nhanVienId: number;
    ngayLamViec: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
}

export interface DatLichHen {
    id: number;
    khachHangId: number;
    sdt: string;
    dichVuId: number;
    nhanVienId: number;
    ngayHen: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    trangThai: string;
}

export interface DanhGiaKhachHang {
    id: number;
    lichHenId: number;
    soSao: number;
    noiDung: string;
    phanHoiCuaNhanVien: string;
}

const STORAGE_KEY = 'dichVuCaToc';
const DICH_VU_CAT_TOC_KEY = 'dichVuCaToc';
const NHAN_VIEN_KEY = 'nhanVienThucHien';
const LICH_LAM_VIEC_KEY = 'lichLamViec';
const DAT_LICH_HEN_KEY = 'datLichHen';
const DANH_GIA_KHACH_HANG_KEY = 'danhGiaKhachHang';
const DEFAULT_DATA: DichVuCaToc[] = [
    { id: 1, tenDichVu: 'Cắt tóc nam', giaTien: 150000, thoiGianThucHien: 30, moTa: 'Dịch vụ cắt tóc cho nam giới' },
    { id: 2, tenDichVu: 'Cắt tóc nữ', giaTien: 200000, thoiGianThucHien: 45, moTa: 'Dịch vụ cắt tóc cho nữ giới' },
    { id: 3, tenDichVu: 'Cắt tóc trẻ em', giaTien: 100000, thoiGianThucHien: 20, moTa: 'Dịch vụ cắt tóc cho trẻ em' },
    { id: 4, tenDichVu: 'Cạo râu', giaTien: 50000, thoiGianThucHien: 15, moTa: 'Dịch vụ cạo râu cho nam giới' },
    { id: 5, tenDichVu: 'Tạo kiểu tóc', giaTien: 250000, thoiGianThucHien: 60, moTa: 'Dịch vụ tạo kiểu tóc theo yêu cầu' },
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


    const [dichVuCaToc, setDichVuCaToc] = useState<DichVuCaToc[]>(() => 
        getSafeData(DICH_VU_CAT_TOC_KEY, DEFAULT_DATA)
    );
    const [nhanVienThucHien, setNhanVienThucHien] = useState<NhanVienThucHien[]>(() =>
        getSafeData(NHAN_VIEN_KEY, [])
    );
    const [lichLamViec, setLichLamViec] = useState<LichLamViec[]>(() =>
        getSafeData(LICH_LAM_VIEC_KEY, [])
    );
    const [datLichHen, setDatLichHen] = useState<DatLichHen[]>(() =>
        getSafeData(DAT_LICH_HEN_KEY, [])
    );
    const [danhGiaKhachHang, setDanhGiaKhachHang] = useState<DanhGiaKhachHang[]>(() =>
        getSafeData(DANH_GIA_KHACH_HANG_KEY, [])
    );

    useEffect(() => {
        localStorage.setItem(DICH_VU_CAT_TOC_KEY, JSON.stringify(dichVuCaToc));
    }, [dichVuCaToc]);
    useEffect(() => {
        localStorage.setItem(NHAN_VIEN_KEY, JSON.stringify(nhanVienThucHien));
    }, [nhanVienThucHien]);
    useEffect(() => {
        localStorage.setItem(LICH_LAM_VIEC_KEY, JSON.stringify(lichLamViec));
    }, [lichLamViec]);
    useEffect(() => {
        localStorage.setItem(DAT_LICH_HEN_KEY, JSON.stringify(datLichHen));
    }, [datLichHen]);
    useEffect(() => {
        localStorage.setItem(DANH_GIA_KHACH_HANG_KEY, JSON.stringify(danhGiaKhachHang));
    }, [danhGiaKhachHang]);

    const addDichVuCaToc = useCallback((item: Omit<DichVuCaToc, 'id'>) => {
        setDichVuCaToc((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            return [...prev, { ...item, id: maxId + 1 }];
        });
    }, [setDichVuCaToc]);
    const addNhanVienThucHien = useCallback((item: Omit<NhanVienThucHien, 'id'>) => {
        setNhanVienThucHien((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            return [...prev, { ...item, id: maxId + 1 }];
        });
    }, [setNhanVienThucHien]);
    const addLichLamViec = useCallback((item: Omit<LichLamViec, 'id'>) => {
        setLichLamViec((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            return [...prev, { ...item, id: maxId + 1 }];
        });
    }, [setLichLamViec]);
    const addDatLichHen = useCallback((item: Omit<DatLichHen, 'id'>) => {
        setDatLichHen((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            return [...prev, { ...item, id: maxId + 1 }];
        });
    }, [setDatLichHen]);
    const addDanhGiaKhachHang = useCallback((item: Omit<DanhGiaKhachHang, 'id'>) => {
        setDanhGiaKhachHang((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
            return [...prev, { ...item, id: maxId + 1 }];
        });
    }, [setDanhGiaKhachHang]);

    const updateDichVuCaToc = useCallback((id: number, updatedItem: Partial<DichVuCaToc>) => {
        setDichVuCaToc((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
        );
    }, [setDichVuCaToc]);
    const updateNhanVienThucHien = useCallback((id: number, updatedItem: Partial<NhanVienThucHien>) => {
        setNhanVienThucHien((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
        );
    }, [setNhanVienThucHien]);
    const updateLichLamViec = useCallback((id: number, updatedItem: Partial<LichLamViec>) => {
        setLichLamViec((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
        );
    }, [setLichLamViec]);
    const updateDatLichHen = useCallback((id: number, updatedItem: Partial<DatLichHen>) => {
        setDatLichHen((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
        );
    }, [setDatLichHen]);
    const updateDanhGiaKhachHang = useCallback((id: number, updatedItem: Partial<DanhGiaKhachHang>) => {
        setDanhGiaKhachHang((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
        );
    }, [setDanhGiaKhachHang]);

    const deleteDichVuCaToc = useCallback((id: number) => {
        setDichVuCaToc((prev) => prev.filter((item) => item.id !== id));
    }, [setDichVuCaToc]);
    const deleteNhanVienThucHien = useCallback((id: number) => {
        setNhanVienThucHien((prev) => prev.filter((item) => item.id !== id));
    }, [setNhanVienThucHien]);
    const deleteLichLamViec = useCallback((id: number) => {
        setLichLamViec((prev) => prev.filter((item) => item.id !== id));
    }, [setLichLamViec]);
    const deleteDatLichHen = useCallback((id: number) => {
        setDatLichHen((prev) => prev.filter((item) => item.id !== id));
    }, [setDatLichHen]);
    const deleteDanhGiaKhachHang = useCallback((id: number) => {
        setDanhGiaKhachHang((prev) => prev.filter((item) => item.id !== id));
    }, [setDanhGiaKhachHang]);

    return {
        dichVuCaToc,
        addDichVuCaToc,
        updateDichVuCaToc,
        deleteDichVuCaToc,
        nhanVienThucHien,
        addNhanVienThucHien,
        updateNhanVienThucHien,
        deleteNhanVienThucHien,
        lichLamViec,
        addLichLamViec,
        updateLichLamViec,
        deleteLichLamViec,
        datLichHen,
        addDatLichHen,
        updateDatLichHen,
        deleteDatLichHen,
        danhGiaKhachHang,
        addDanhGiaKhachHang,
        updateDanhGiaKhachHang,
        deleteDanhGiaKhachHang
    };

};