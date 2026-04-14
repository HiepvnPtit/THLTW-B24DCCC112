import useInitModel from '@/hooks/useInitModel';
import type { IKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline/typing';

export default () => {
	const objInit = useInitModel<IKhoaHoc.IRecord>('khoaHoc');

	return {
		...objInit,
	};
};
