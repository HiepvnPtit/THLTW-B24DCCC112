import useInitModel from '@/hooks/useInitModel';
import type { IAuditLogRecord } from '@/services/QuanLyCauLacBo/typing';

export default () => {
	const objInit = useInitModel<IAuditLogRecord>('club-audit-log');

	return {
		...objInit,
	};
};
