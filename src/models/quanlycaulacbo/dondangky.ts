import useInitModel from '@/hooks/useInitModel';
import {
	duyetDonDangKyHangLoat,
	postClubAuditLog,
	tuChoiDonDangKyHangLoat,
} from '@/services/QuanLyCauLacBo';
import { EClubAuditAction } from '@/services/QuanLyCauLacBo/constant';
import type { IRegistrationRecord } from '@/services/QuanLyCauLacBo/typing';

export default () => {
	const objInit = useInitModel<IRegistrationRecord>('club-registration');
	const { formSubmiting, setFormSubmiting, getModel } = objInit;

	const duyetDonHangLoatModel = async (ids: string[], getData?: () => void): Promise<void> => {
		if (!ids?.length) return;
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			await duyetDonDangKyHangLoat(ids);
			await postClubAuditLog({
				action: EClubAuditAction.APPROVE_REGISTRATION,
				requestType: 'PUT',
				data: { ids },
			});
			if (getData) getData();
			else getModel();
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const tuChoiDonHangLoatModel = async (ids: string[], lyDoTuChoi: string, getData?: () => void): Promise<void> => {
		if (!ids?.length) return;
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			await tuChoiDonDangKyHangLoat(ids, lyDoTuChoi);
			await postClubAuditLog({
				action: EClubAuditAction.REJECT_REGISTRATION,
				requestType: 'PUT',
				data: { ids, lyDoTuChoi },
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
		duyetDonHangLoatModel,
		tuChoiDonHangLoatModel,
	};
};
