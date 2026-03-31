import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { EClubAuditAction } from './constant';

export const duyetDonDangKyHangLoat = (ids: string[]) => {
	return axios.put(`${ip3}/club-registration/many/approve`, { ids });
};

export const tuChoiDonDangKyHangLoat = (ids: string[], lyDoTuChoi: string) => {
	return axios.put(`${ip3}/club-registration/many/reject`, { ids, lyDoTuChoi });
};

export const doiClbHangLoatChoThanhVien = (ids: string[], idCauLacBo: string) => {
	return axios.put(`${ip3}/club-member/many/change-club`, { ids, idCauLacBo });
};

export const getBaoCaoTrangThaiDonTheoClb = () => {
	return axios.get(`${ip3}/club-registration/report/status-by-club`);
};

export const postClubAuditLog = (payload: {
	action: EClubAuditAction;
	data?: Record<string, any>;
	requestType?: string;
}) => {
	return axios.post(`${ip3}/club-audit-log`, payload);
};
