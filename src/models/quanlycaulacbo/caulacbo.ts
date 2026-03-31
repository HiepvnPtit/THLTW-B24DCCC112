import useInitModel from '@/hooks/useInitModel';
import type { IClubRecord } from '@/services/QuanLyCauLacBo/typing';

export default () => {
	const objInit = useInitModel<IClubRecord>('club');

	return {
		...objInit,
	};
};
