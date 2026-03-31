import type { EClubAuditAction, ETrangThaiDonDangKy } from './constant';

declare module Club {
	export interface IClubRecord {
		_id: string;
		avatar?: string;
		tenClb: string;
		ngayThanhLap: string;
		moTa: string;
		chuNhiem: string;
		hoatDong: boolean;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRegistrationRecord {
		_id: string;
		hoTenUngVien: string;
		mssv: string;
		email: string;
		soDienThoai?: string;
		idCauLacBo: string;
		tenCauLacBo: string;
		trangThai: ETrangThaiDonDangKy;
		lyDoTuChoi?: string;
		createdAt: string;
		updatedAt?: string;
	}

	export interface IMemberRecord {
		_id: string;
		hoTenUngVien: string;
		mssv: string;
		email: string;
		soDienThoai?: string;
		idCauLacBo: string;
		tenCauLacBo: string;
		trangThai: ETrangThaiDonDangKy;
		createdAt: string;
		updatedAt?: string;
	}

	export interface IAuditLogRecord {
		_id: string;
		uId?: string;
		uCode?: string;
		uEmail?: string;
		uName?: string;
		action: EClubAuditAction;
		requestType?: string;
		ip?: string;
		data?: any;
		query?: any;
		param?: any;
		userAgent?: string;
		response?: any;
		createdAt: string;
	}

	export interface IReportByClub {
		tenCauLacBo: string;
		pending: number;
		approved: number;
		rejected: number;
	}
}
