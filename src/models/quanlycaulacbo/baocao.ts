import { getBaoCaoTrangThaiDonTheoClb } from '@/services/QuanLyCauLacBo';
import type { IReportByClub } from '@/services/QuanLyCauLacBo/typing';
import { useState } from 'react';

export default () => {
	const [loadingBaoCao, setLoadingBaoCao] = useState(false);
	const [duLieuBaoCao, setDuLieuBaoCao] = useState<IReportByClub[]>([]);

	const getBaoCaoModel = async () => {
		setLoadingBaoCao(true);
		try {
			const response = await getBaoCaoTrangThaiDonTheoClb();
			const data = response?.data?.data ?? [];
			setDuLieuBaoCao(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoadingBaoCao(false);
		}
	};

	return {
		loadingBaoCao,
		duLieuBaoCao,
		getBaoCaoModel,
	};
};
