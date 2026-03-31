import type { TFilter } from '@/components/Table/typing';
import { EOperatorType } from '@/components/Table/constant';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type TrangThaiDonDangKy = 'Pending' | 'Approved' | 'Rejected';
export type GioiTinh = 'Nam' | 'Nữ' | 'Khác';

export interface CauLacBo {
	id: string;
	anhDaiDien?: string;
	tenClb: string;
	ngayThanhLap: string;
	moTaHtml?: string;
	moTa?: string;
	chuNhiem: string;
	hoatDong: boolean;
	soHienTai: number;
	tongLuotTraCuu: number;
}

export interface DonDangKy {
	id: string;
	soThuTu: number;
	hoTenUngVien: string;
	email: string;
	soDienThoai?: string;
	gioiTinh?: GioiTinh;
	diaChi?: string;
	soTruong?: string;
	lyDoDangKy?: string;
	idCauLacBo: string;
	tenCauLacBo: string;
	trangThai: TrangThaiDonDangKy;
	ghiChu?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface LichSuThaoTac {
	id: string;
	action: string;
	donDangKyId: string;
	admin: string;
	lyDo?: string;
	thoiGian: string;
}

export interface SearchDonDangKyParams {
	hoTenUngVien?: string;
	email?: string;
	soDienThoai?: string;
	tenCauLacBo?: string;
}

export interface TongQuanBaoCao {
	tongClb: number;
	pending: number;
	approved: number;
	rejected: number;
}

const CAU_LAC_BO_KEY = 'clb.danhMucCauLacBo';
const DON_DANG_KY_KEY = 'clb.danhMucDonDangKy';
const LICH_SU_KEY = 'clb.lichSuThaoTac';

const getFieldValue = (item: any, field: any) => {
	if (Array.isArray(field)) return field.reduce((acc, cur) => (acc ? acc[cur] : undefined), item);
	return item?.[field];
};

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

	const [danhMucCauLacBo, setDanhMucCauLacBo] = useState<CauLacBo[]>(() => getSafeData(CAU_LAC_BO_KEY, []));
	const [danhMucDonDangKy, setDanhMucDonDangKy] = useState<DonDangKy[]>(() => getSafeData(DON_DANG_KY_KEY, []));
	const [lichSuThaoTac, setLichSuThaoTac] = useState<LichSuThaoTac[]>(() => getSafeData(LICH_SU_KEY, []));

	const [danhSach, setDanhSach] = useState<any[]>([]);
	const [record, setRecord] = useState<any>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [filters, setFilters] = useState<TFilter<any>[]>([]);
	const [condition, setCondition] = useState<any>({});
	const [sort, setSort] = useState<Record<string, 1 | -1> | undefined>();
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [selectedIds, setSelectedIds] = useState<string[]>();
	const initFilter: TFilter<any>[] = useMemo(() => [], []);
 	const adminName = 'Admin';

	useEffect(() => {
		localStorage.setItem(CAU_LAC_BO_KEY, JSON.stringify(danhMucCauLacBo));
	}, [danhMucCauLacBo]);

	useEffect(() => {
		// Migrate legacy `moTa` to `moTaHtml` so existing localStorage data renders as HTML.
		setDanhMucCauLacBo((prev) =>
			prev.map((item) => ({
				...item,
				moTaHtml: item.moTaHtml ?? item.moTa ?? '',
			})),
		);
	}, []);

	useEffect(() => {
		localStorage.setItem(DON_DANG_KY_KEY, JSON.stringify(danhMucDonDangKy));
	}, [danhMucDonDangKy]);

	useEffect(() => {
		localStorage.setItem(LICH_SU_KEY, JSON.stringify(lichSuThaoTac));
	}, [lichSuThaoTac]);

	const applyFilterAndSort = useCallback(
		(data: any[]) => {
			let temp = [...data];
			const activeFilters = (filters || []).filter((item) => item?.active !== false);

			temp = temp.filter((item) => {
				return activeFilters.every((f) => {
					const val = getFieldValue(item, f.field);
					if (f.operator === EOperatorType.CONTAIN) {
						const keyword = `${f.values?.[0] ?? ''}`.toLowerCase();
						return `${val ?? ''}`.toLowerCase().includes(keyword);
					}
					if (f.operator === EOperatorType.INCLUDE) return (f.values || []).includes(val);
					if (f.operator === EOperatorType.BETWEEN) {
						const from = f.values?.[0];
						const to = f.values?.[1];
						if (!from || !to || !val) return true;
						const time = new Date(val).getTime();
						return time >= new Date(from).getTime() && time <= new Date(to).getTime();
					}
					return true;
				});
			});

			if (sort && Object.keys(sort).length) {
				const sortKey = Object.keys(sort)[0];
				const sortType = sort[sortKey] ?? 1;
				temp.sort((a, b) => {
					const va = getFieldValue(a, sortKey);
					const vb = getFieldValue(b, sortKey);
					if (va === vb) return 0;
					if (va === undefined || va === null) return 1;
					if (vb === undefined || vb === null) return -1;
					return va > vb ? sortType : -sortType;
				});
			}

			return temp;
		},
		[filters, sort],
	);

	const paginateAndSetDanhSach = useCallback(
		(data: any[]) => {
			const finalData = applyFilterAndSort(data);
			const start = (page - 1) * limit;
			const end = start + limit;
			setTotal(finalData.length);
			setDanhSach(finalData.slice(start, end));
			return finalData;
		},
		[applyFilterAndSort, page, limit],
	);

	const getDanhSachCauLacBo = useCallback(async () => {
		setLoading(true);
		try {
			return paginateAndSetDanhSach(danhMucCauLacBo);
		} finally {
			setLoading(false);
		}
	}, [danhMucCauLacBo, paginateAndSetDanhSach]);

	const getDanhSachDonDangKy = useCallback(async () => {
		setLoading(true);
		try {
			return paginateAndSetDanhSach(danhMucDonDangKy);
		} finally {
			setLoading(false);
		}
	}, [danhMucDonDangKy, paginateAndSetDanhSach]);

	const getDanhSachThanhVien = useCallback(async () => {
		setLoading(true);
		try {
			const data = danhMucDonDangKy.filter((item) => item.trangThai === 'Approved');
			return paginateAndSetDanhSach(data);
		} finally {
			setLoading(false);
		}
	}, [danhMucDonDangKy, paginateAndSetDanhSach]);

	const getModel = useCallback(async () => {
		if (condition?.view === 'member') return getDanhSachThanhVien();
		if (condition?.view === 'registration') return getDanhSachDonDangKy();
		return getDanhSachCauLacBo();
	}, [condition?.view, getDanhSachCauLacBo, getDanhSachDonDangKy, getDanhSachThanhVien]);

	const addCauLacBo = useCallback((data: Omit<CauLacBo, 'id' | 'soHienTai' | 'tongLuotTraCuu'>) => {
		const newData: CauLacBo = {
			...data,
			moTaHtml: data.moTaHtml ?? data.moTa ?? '',
			id: Date.now().toString(),
			soHienTai: 0,
			tongLuotTraCuu: 0,
			hoatDong: data.hoatDong ?? true,
		};
		setDanhMucCauLacBo((prev) => [...prev, newData]);
		message.success('Thêm CLB thành công');
	}, []);

	const updateCauLacBo = useCallback((data: CauLacBo) => {
		setDanhMucCauLacBo((prev) => prev.map((item) => (item.id === data.id ? data : item)));
		message.success('Cập nhật CLB thành công');
	}, []);

	const deleteCauLacBo = useCallback((id: string) => {
		setDanhMucCauLacBo((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa CLB thành công');
	}, []);

	const addDonDangKy = useCallback(
		(data: Omit<DonDangKy, 'id' | 'soThuTu' | 'createdAt' | 'trangThai' | 'tenCauLacBo' | 'updatedAt'>) => {
			const clb = danhMucCauLacBo.find((item) => item.id === data.idCauLacBo);
			if (!clb) {
				message.error('Câu lạc bộ không tồn tại');
				return;
			}
			if (!clb.hoatDong) {
				message.warning('CLB đang ngừng hoạt động, không thể tạo đơn đăng ký');
				return;
			}

			const soThuTuMoi = clb.soHienTai + 1;
			const newData: DonDangKy = {
				...data,
				id: Date.now().toString(),
				soThuTu: soThuTuMoi,
				tenCauLacBo: clb.tenClb,
				trangThai: 'Pending',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			setDanhMucDonDangKy((prev) => [...prev, newData]);
			setDanhMucCauLacBo((prev) =>
				prev.map((item) => (item.id === clb.id ? { ...item, soHienTai: soThuTuMoi } : item)),
			);
			message.success('Tạo đơn đăng ký thành công');
		},
		[danhMucCauLacBo],
	);

	const updateDonDangKy = useCallback((data: DonDangKy) => {
		setDanhMucDonDangKy((prev) =>
			prev.map((item) => (item.id === data.id ? { ...data, updatedAt: new Date().toISOString() } : item)),
		);
		message.success('Cập nhật đơn đăng ký thành công');
	}, []);

	const deleteDonDangKy = useCallback((id: string) => {
		setDanhMucDonDangKy((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa đơn đăng ký thành công');
	}, []);

	const duyetDonDangKy = useCallback((ids: string[]) => {
		if (!ids?.length) return;
		setDanhMucDonDangKy((prev) =>
			prev.map((item) =>
				ids.includes(item.id) && item.trangThai === 'Pending'
					? { ...item, trangThai: 'Approved', updatedAt: new Date().toISOString(), ghiChu: undefined }
					: item,
			),
		);
		const logs: LichSuThaoTac[] = ids.map((id) => ({
			id: `${Date.now()}-${id}`,
			action: 'APPROVE',
			donDangKyId: id,
			admin: adminName,
			thoiGian: new Date().toISOString(),
		}));
		setLichSuThaoTac((prev) => [...logs, ...prev]);
		message.success(`Đã duyệt ${ids.length} đơn`);
	}, [adminName]);

	const tuChoiDonDangKy = useCallback((ids: string[], lyDo: string) => {
		if (!ids?.length) return;
		if (!lyDo?.trim()) throw new Error('Vui lòng nhập lý do từ chối');
		setDanhMucDonDangKy((prev) =>
			prev.map((item) =>
				ids.includes(item.id) && item.trangThai === 'Pending'
					? { ...item, trangThai: 'Rejected', ghiChu: lyDo.trim(), updatedAt: new Date().toISOString() }
					: item,
			),
		);
		const logs: LichSuThaoTac[] = ids.map((id) => ({
			id: `${Date.now()}-${id}`,
			action: 'REJECT',
			donDangKyId: id,
			admin: adminName,
			lyDo: lyDo.trim(),
			thoiGian: new Date().toISOString(),
		}));
		setLichSuThaoTac((prev) => [...logs, ...prev]);
		message.success(`Đã từ chối ${ids.length} đơn`);
	}, [adminName]);

	const doiClbThanhVienHangLoat = useCallback(
		(ids: string[], idCauLacBo: string) => {
			if (!ids?.length) return;
			const clbMoi = danhMucCauLacBo.find((item) => item.id === idCauLacBo);
			if (!clbMoi) {
				message.error('Câu lạc bộ mới không tồn tại');
				return;
			}

			setDanhMucDonDangKy((prev) =>
				prev.map((item) =>
					ids.includes(item.id) && item.trangThai === 'Approved'
						? { ...item, idCauLacBo: clbMoi.id, tenCauLacBo: clbMoi.tenClb, updatedAt: new Date().toISOString() }
						: item,
				),
			);

			const logs: LichSuThaoTac[] = ids.map((id) => ({
				id: `${Date.now()}-${id}`,
				action: 'CHANGE_CLUB',
				donDangKyId: id,
				admin: adminName,
				lyDo: `Chuyển sang CLB: ${clbMoi.tenClb}`,
				thoiGian: new Date().toISOString(),
			}));
			setLichSuThaoTac((prev) => [...logs, ...prev]);
			message.success(`Đã đổi CLB cho ${ids.length} thành viên`);
		},
		[danhMucCauLacBo, adminName],
	);

	const traCuuDonDangKy = useCallback(
		(params: SearchDonDangKyParams) => {
			const filledParams = Object.values(params).filter((v) => !!v);
			if (filledParams.length < 2) {
				throw new Error('Yêu cầu nhập ít nhất 2 tham số để tra cứu');
			}

			const results = danhMucDonDangKy.filter((item) => {
				return (
					(!params.hoTenUngVien || item.hoTenUngVien.toLowerCase().includes(params.hoTenUngVien.toLowerCase())) &&
					(!params.email || item.email === params.email) &&
					(!params.soDienThoai || item.soDienThoai === params.soDienThoai) &&
					(!params.tenCauLacBo || item.tenCauLacBo.toLowerCase().includes(params.tenCauLacBo.toLowerCase()))
				);
			});

			if (results.length > 0) {
				const clbId = results[0].idCauLacBo;
				setDanhMucCauLacBo((prev) =>
					prev.map((item) =>
						item.id === clbId ? { ...item, tongLuotTraCuu: item.tongLuotTraCuu + 1 } : item,
					),
				);
			}
			return results;
		},
		[danhMucDonDangKy],
	);

	const baoCaoTrangThaiDon = useMemo(() => {
		return danhMucCauLacBo.map((clb) => {
			const donTheoClb = danhMucDonDangKy.filter((d) => d.idCauLacBo === clb.id);
			return {
				tenClb: clb.tenClb,
				pending: donTheoClb.filter((d) => d.trangThai === 'Pending').length,
				approved: donTheoClb.filter((d) => d.trangThai === 'Approved').length,
				rejected: donTheoClb.filter((d) => d.trangThai === 'Rejected').length,
			};
		});
	}, [danhMucCauLacBo, danhMucDonDangKy]);

	const thongKeTongQuan: TongQuanBaoCao = useMemo(
		() => ({
			tongClb: danhMucCauLacBo.length,
			pending: danhMucDonDangKy.filter((item) => item.trangThai === 'Pending').length,
			approved: danhMucDonDangKy.filter((item) => item.trangThai === 'Approved').length,
			rejected: danhMucDonDangKy.filter((item) => item.trangThai === 'Rejected').length,
		}),
		[danhMucCauLacBo, danhMucDonDangKy],
	);

	const getThanhVienTheoClb = useCallback(
		(idCauLacBo: string) =>
			danhMucDonDangKy.filter((item) => item.idCauLacBo === idCauLacBo && item.trangThai === 'Approved'),
		[danhMucDonDangKy],
	);

	const deleteModel = async (id: string | number, getDataCb?: () => void) => {
		if (condition?.view === 'registration') deleteDonDangKy(String(id));
		else deleteCauLacBo(String(id));
		if (getDataCb) getDataCb();
	};

	const deleteManyModel = async (ids: (string | number)[], getDataCb?: () => void) => {
		if (condition?.view === 'registration') {
			setDanhMucDonDangKy((prev) => prev.filter((item) => !ids.includes(item.id)));
		} else {
			setDanhMucCauLacBo((prev) => prev.filter((item) => !ids.includes(item.id)));
		}
		if (getDataCb) getDataCb();
	};

	const handleEdit = (rec?: any) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: any) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	return {
		danhMucCauLacBo,
		addCauLacBo,
		updateCauLacBo,
		deleteCauLacBo,
		danhMucDonDangKy,
		addDonDangKy,
		updateDonDangKy,
		deleteDonDangKy,
		duyetDonDangKy,
		tuChoiDonDangKy,
		traCuuDonDangKy,
		lichSuThaoTac,
		baoCaoTrangThaiDon,
		thongKeTongQuan,
		getThanhVienTheoClb,
		getDanhSachCauLacBo,
		getDanhSachDonDangKy,
		getDanhSachThanhVien,
		doiClbThanhVienHangLoat,
		// Compatibility for TableBase
		danhSach,
		record,
		setRecord,
		page,
		setPage,
		limit,
		setLimit,
		total,
		loading,
		formSubmiting,
		setFormSubmiting,
		filters,
		setFilters,
		initFilter,
		condition,
		setCondition,
		sort,
		setSort,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		selectedIds,
		setSelectedIds,
		getModel,
		deleteModel,
		deleteManyModel,
		handleEdit,
		handleView,
	};
};
