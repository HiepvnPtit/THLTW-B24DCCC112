import { STORAGE_KEY, STORAGE_KEY_HOC_VIEN } from './constant';
import type { IKhoaHoc } from './typing';


export const getKhoaHocList = async (): Promise<IKhoaHoc.IRecord[]> => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

export const createKhoaHoc = async (payload: Omit<IKhoaHoc.IRecord, '_id' | 'createdAt'>): Promise<IKhoaHoc.IRecord> => {
	const list = await getKhoaHocList();
	const newRecord: IKhoaHoc.IRecord = {
		...payload,
		_id: `kh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
		danhSachHocVien: payload.danhSachHocVien || [],
	};
	list.push(newRecord);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	return newRecord;
};

export const updateKhoaHoc = async (id: string, payload: Partial<IKhoaHoc.IRecord>): Promise<IKhoaHoc.IRecord> => {
	const list = await getKhoaHocList();
	const index = list.findIndex((item) => item._id === id);
	if (index === -1) throw new Error('Không tìm thấy khóa học');

	list[index] = {
		...list[index],
		...payload,
		_id: id,
		updatedAt: new Date().toISOString(),
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	return list[index];
};

export const deleteKhoaHoc = async (id: string): Promise<void> => {
	const list = await getKhoaHocList();
	const filtered = list.filter((item) => item._id !== id);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getHocVienByKhoaHoc = async (idKhoaHoc: string): Promise<IKhoaHoc.IHocVien[]> => {
	const data = localStorage.getItem(STORAGE_KEY_HOC_VIEN);
	const allHocVien = data ? JSON.parse(data) : [];
	return allHocVien.filter((hv: IKhoaHoc.IHocVien) => hv.idKhoaHoc === idKhoaHoc);
};

export const addHocVienToKhoaHoc = async (
	idKhoaHoc: string,
	hocVien: Omit<IKhoaHoc.IHocVien, '_id' | 'createdAt'>,
): Promise<IKhoaHoc.IHocVien> => {
	const data = localStorage.getItem(STORAGE_KEY_HOC_VIEN);
	const allHocVien = data ? JSON.parse(data) : [];

	const newHocVien: IKhoaHoc.IHocVien = {
		...hocVien,
		_id: `hv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		createdAt: new Date().toISOString(),
	};

	allHocVien.push(newHocVien);
	localStorage.setItem(STORAGE_KEY_HOC_VIEN, JSON.stringify(allHocVien));


	const khoaHoc = await getKhoaHocList();
	const course = khoaHoc.find((k) => k._id === idKhoaHoc);
	if (course) {
		if (!course.danhSachHocVien) course.danhSachHocVien = [];
		course.danhSachHocVien.push(newHocVien._id);
		course.soHocVien = course.danhSachHocVien.length;
		await updateKhoaHoc(idKhoaHoc, { danhSachHocVien: course.danhSachHocVien, soHocVien: course.soHocVien });
	}

	return newHocVien;
};
