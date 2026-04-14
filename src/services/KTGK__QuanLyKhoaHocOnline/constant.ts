export enum ETrangThaiKhoaHoc {
	DANG_MO = 'DANG_MO',
	DA_KET_THUC = 'DA_KET_THUC',
	TAM_DUN = 'TAM_DUN',
}

export const TRANG_THAI_KHOA_HOC_LABEL: Record<ETrangThaiKhoaHoc, string> = {
	[ETrangThaiKhoaHoc.DANG_MO]: 'Đang mở',
	[ETrangThaiKhoaHoc.DA_KET_THUC]: 'Đã kết thúc',
	[ETrangThaiKhoaHoc.TAM_DUN]: 'Tạm dừng',
};

export const TRANG_THAI_KHOA_HOC_COLOR: Record<ETrangThaiKhoaHoc, string> = {
	[ETrangThaiKhoaHoc.DANG_MO]: 'green',
	[ETrangThaiKhoaHoc.DA_KET_THUC]: 'red',
	[ETrangThaiKhoaHoc.TAM_DUN]: 'orange',
};

export const DANH_SACH_GIANG_VIEN = [
	{ id: '1', ten: 'ThS. Nguyễn Văn A' },
	{ id: '2', ten: 'TS. Trần Thị B' },
	{ id: '3', ten: 'ThS. Lê Văn C' },
	{ id: '4', ten: 'PGS. Phạm Thị D' },
	{ id: '5', ten: 'ThS. Hoàng Văn E' },
];

export const STORAGE_KEY = 'KTGK__danhSachKhoaHoc';
export const STORAGE_KEY_HOC_VIEN = 'KTGK__danhSachHocVien';
