import useInitModel from '@/hooks/useInitModel';
import { doiClbHangLoatChoThanhVien, postClubAuditLog } from '@/services/QuanLyCauLacBo';
import { EClubAuditAction, ETrangThaiDonDangKy } from '@/services/QuanLyCauLacBo/constant';
import type { IMemberRecord } from '@/services/QuanLyCauLacBo/typing';

export default () => {
	const objInit = useInitModel<IMemberRecord>('club-member', undefined, {
		trangThai: ETrangThaiDonDangKy.APPROVED,
	});
	const { formSubmiting, setFormSubmiting, getModel } = objInit;

	const doiClbHangLoatModel = async (ids: string[], idCauLacBo: string, getData?: () => void): Promise<void> => {
		if (!ids?.length) return;
		if (!idCauLacBo) return Promise.reject('idCauLacBo is required');
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			await doiClbHangLoatChoThanhVien(ids, idCauLacBo);
			await postClubAuditLog({
				action: EClubAuditAction.CHANGE_MEMBER_CLUB,
				requestType: 'PUT',
				data: { ids, idCauLacBo },
			});
			if (getData) getData();
			else getModel();
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		doiClbHangLoatModel,
	};
};
