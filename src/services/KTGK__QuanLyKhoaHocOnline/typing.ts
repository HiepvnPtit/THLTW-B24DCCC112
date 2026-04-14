import type { ETrangThaiKhoaHoc } from './constant';

export namespace IKhoaHoc {
	export interface IRecord {
		_id: string;
		ten: string;
		idGiangVien: string;
		tenGiangVien: string;
		soHocVien: number;
		moTa: string;
		trangThai: ETrangThaiKhoaHoc;
		danhSachHocVien: string[];
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IHocVien {
		_id: string;
		ten: string;
		email: string;
		trangThai: 'DANG_HOC' | 'DA_HOC' | 'BO_HOC';
		idKhoaHoc: string;
		createdAt?: string;
	}
}
