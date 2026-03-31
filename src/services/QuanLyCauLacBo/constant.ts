export enum ETrangThaiDonDangKy {
	PENDING = 'Pending',
	APPROVED = 'Approved',
	REJECTED = 'Rejected',
}

export const MAP_TEN_TRANG_THAI_DON: Record<ETrangThaiDonDangKy, string> = {
	[ETrangThaiDonDangKy.PENDING]: 'Chờ duyệt',
	[ETrangThaiDonDangKy.APPROVED]: 'Đã duyệt',
	[ETrangThaiDonDangKy.REJECTED]: 'Từ chối',
};

export const MAP_MAU_TRANG_THAI_DON: Record<ETrangThaiDonDangKy, string> = {
	[ETrangThaiDonDangKy.PENDING]: 'gold',
	[ETrangThaiDonDangKy.APPROVED]: 'green',
	[ETrangThaiDonDangKy.REJECTED]: 'red',
};

export enum EClubAuditAction {
	CREATE_CLUB = 'CREATE_CLUB',
	UPDATE_CLUB = 'UPDATE_CLUB',
	DELETE_CLUB = 'DELETE_CLUB',
	APPROVE_REGISTRATION = 'APPROVE_REGISTRATION',
	REJECT_REGISTRATION = 'REJECT_REGISTRATION',
	CHANGE_MEMBER_CLUB = 'CHANGE_MEMBER_CLUB',
}

export const MAP_CLUB_AUDIT_ACTION: Record<EClubAuditAction, string> = {
	[EClubAuditAction.CREATE_CLUB]: 'Tạo mới CLB',
	[EClubAuditAction.UPDATE_CLUB]: 'Cập nhật CLB',
	[EClubAuditAction.DELETE_CLUB]: 'Xóa CLB',
	[EClubAuditAction.APPROVE_REGISTRATION]: 'Duyệt đơn đăng ký',
	[EClubAuditAction.REJECT_REGISTRATION]: 'Từ chối đơn đăng ký',
	[EClubAuditAction.CHANGE_MEMBER_CLUB]: 'Đổi CLB cho thành viên',
};
