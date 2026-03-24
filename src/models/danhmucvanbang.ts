import { useCallback, useEffect, useState } from 'react';



export interface SoVanBang {
  id: string;
  tenSo: string;
  year: number;
  soHienTai: number;
  trangThai: 'active' | 'closed';
}

export interface QuyetDinh {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: string;
  trichYeu: string;
  soVanBangId: string;
  tongLuotTraCuu: number;
}

export type FieldType = 'String' | 'Number' | 'Date';

export interface FieldConfig {
  id: string;
  tenTruong: string;
  maTruong: string;
  kieuDuLieu: FieldType;
  batBuoc: boolean;
}

export interface VanBang {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  quyetDinhId: string;
  extraFields: Record<string, any>;
}

export interface SearchVanBangParams {
  soHieuVanBang?: string;
  soVaoSo?: string;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: string;
}

const STORAGE_KEY = 'danhMucVanBang';
const QUYETDINH_KEY = 'danhMucQuyetDinh';
const SOVANBANG_KEY = 'danhMucSoVanBang';
const FIELD_CONFIG_KEY = 'fieldConfig';

export default () => {
  const getSafeData = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultValue;
  };


  const [danhMucSoVanBang, setDanhMucSoVanBang] = useState<SoVanBang[]>(() => getSafeData(SOVANBANG_KEY, []));
  const [danhMucQuyetDinh, setDanhMucQuyetDinh] = useState<QuyetDinh[]>(() => getSafeData(QUYETDINH_KEY, []));
  const [danhMucVanBang, setDanhMucVanBang] = useState<VanBang[]>(() => getSafeData(STORAGE_KEY, []));
  const [fieldConfig, setFieldConfig] = useState<FieldConfig[]>(() => getSafeData(FIELD_CONFIG_KEY, []));

  useEffect(() => { localStorage.setItem(SOVANBANG_KEY, JSON.stringify(danhMucSoVanBang)) }, [danhMucSoVanBang]);
  useEffect(() => { localStorage.setItem(QUYETDINH_KEY, JSON.stringify(danhMucQuyetDinh)) }, [danhMucQuyetDinh]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(danhMucVanBang)) }, [danhMucVanBang]);
  useEffect(() => { localStorage.setItem(FIELD_CONFIG_KEY, JSON.stringify(fieldConfig)) }, [fieldConfig]);


  const addVanBang = useCallback((data: Omit<VanBang, 'id' | 'soVaoSo'>) => {
    const qd = danhMucQuyetDinh.find((q) => q.id === data.quyetDinhId);
    if (!qd) return alert('Quyết định không tồn tại');

    const soIndex = danhMucSoVanBang.findIndex((s) => s.id === qd.soVanBangId);
    if (soIndex === -1) return alert('Sổ văn bằng không tồn tại');
    if (danhMucSoVanBang[soIndex].trangThai === 'closed') return alert('Sổ này đã đóng, không thể thêm bằng');

    const soVaoSoMoi = danhMucSoVanBang[soIndex].soHienTai + 1;

    const newVB: VanBang = {
      ...data,
      id: Date.now().toString(),
      soVaoSo: soVaoSoMoi,
    };

    setDanhMucVanBang((prev) => [...prev, newVB]);
    setDanhMucSoVanBang((prev) => {
      const newSo = [...prev];
      newSo[soIndex].soHienTai = soVaoSoMoi;
      return newSo;
    });
  }, [danhMucQuyetDinh, danhMucSoVanBang]);

  const updateVanBang = (data: VanBang) => {
    setDanhMucVanBang(prev => prev.map(item => item.id === data.id ? data : item));
  };

  const deleteVanBang = (id: string) => {
    setDanhMucVanBang(prev => prev.filter(item => item.id !== id));
  };


  const traCuuVanBang = useCallback((params: SearchVanBangParams) => {
    const filledParams = Object.values(params).filter((v) => !!v);
    if (filledParams.length < 2) {
      throw new Error('Yêu cầu nhập ít nhất 2 tham số để tra cứu');
    }

    const results = danhMucVanBang.filter((vb) => {
      return (
        (!params.soHieuVanBang || vb.soHieuVanBang === params.soHieuVanBang) &&
        (!params.maSinhVien || vb.maSinhVien === params.maSinhVien) &&
        (!params.hoTen || vb.hoTen.toLowerCase().includes(params.hoTen.toLowerCase())) &&
        (!params.soVaoSo || vb.soVaoSo.toString() === params.soVaoSo) &&
        (!params.ngaySinh || vb.ngaySinh === params.ngaySinh)
      );
    });

    if (results.length > 0) {
      const qdId = results[0].quyetDinhId;
      setDanhMucQuyetDinh((prev) =>
        prev.map((qd) => (qd.id === qdId ? { ...qd, tongLuotTraCuu: qd.tongLuotTraCuu + 1 } : qd)),
      );
    }
    return results;
  }, [danhMucVanBang]);

  const addSoVanBang = (so: Omit<SoVanBang, 'id'>) => {
    const newSo: SoVanBang = { ...so, id: Date.now().toString() };
    setDanhMucSoVanBang((prev) => [...prev, newSo]);
  };

  const addQuyetDinh = (qd: Omit<QuyetDinh, 'id' | 'tongLuotTraCuu'>) => {
    const newQD: QuyetDinh = { ...qd, id: Date.now().toString(), tongLuotTraCuu: 0 };
    setDanhMucQuyetDinh((prev) => [...prev, newQD]);
  };

  const deleteQuyetDinh = (id: string) => {
    setDanhMucQuyetDinh(prev => prev.filter(item => item.id !== id));
  };
  const updateSoVanBang = (data: SoVanBang) => {
    setDanhMucSoVanBang(prev => prev.map(item => item.id === data.id ? data : item));
  };

  const deleteSoVanBang = (id: string) => {
    setDanhMucSoVanBang(prev => prev.filter(item => item.id !== id));
  };
  const updateQuyetDinh = (data: QuyetDinh) => {
    setDanhMucQuyetDinh(prev => prev.map(item => item.id === data.id ? data : item));
  };

  return {
    danhMucSoVanBang,
    addSoVanBang,
    updateSoVanBang,
    deleteSoVanBang,

    danhMucQuyetDinh,
    addQuyetDinh,
    deleteQuyetDinh,
    updateQuyetDinh,
    danhMucVanBang,
    addVanBang,
    updateVanBang,
    deleteVanBang,
    traCuuVanBang,
    fieldConfig,
    updateFieldConfig: setFieldConfig,
  };
};