import useKTGK__KhoaHocModel from '@/hooks/useKTGK__KhoaHocModel';
import { DANH_SACH_GIANG_VIEN, TRANG_THAI_KHOA_HOC_COLOR, TRANG_THAI_KHOA_HOC_LABEL } from '@/services/KTGK__QuanLyKhoaHocOnline/constant';
import type { IKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline/typing';
import type { ETrangThaiKhoaHoc } from '@/services/KTGK__QuanLyKhoaHocOnline/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import FormKTGK__KhoaHoc from './components/Form';

const KTGK__DanhSachKhoaHoc = () => {
	const {
		danhSach,
		limit,
		setRecord,
		record: selectedRecord,
		getModel,
		deleteModel,
		setVisibleForm,
		edit,
		setEdit,
		visibleForm,
		loading,
		postModel,
		putModel,
		formSubmiting,
	} = useKTGK__KhoaHocModel();
	const [searchKeyword, setSearchKeyword] = useState<string>('');

	const filteredDanhSach = useMemo(() => {
		const keyword = searchKeyword.trim().toLowerCase();
		if (!keyword) return danhSach;
		return danhSach.filter((item) => item.ten?.toLowerCase().includes(keyword));
	}, [danhSach, searchKeyword]);

	const columns: ColumnsType<IKhoaHoc.IRecord> = [
		{
			title: 'ID',
			dataIndex: '_id',
			width: 150,
			render: (val) => val?.substring(0, 12) + '...',
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'ten',
			width: 250,
			sorter: (a, b) => a.ten.localeCompare(b.ten),
		},
		{
			title: 'Giảng viên',
			dataIndex: 'tenGiangVien',
			width: 150,
			filters: DANH_SACH_GIANG_VIEN.map((gv) => ({
				text: gv.ten,
				value: gv.ten,
			})),
			onFilter: (value, row) => row.tenGiangVien === value,
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'soHocVien',
			width: 120,
			align: 'center',
			sorter: (a, b) => a.soHocVien - b.soHocVien,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			filters: Object.entries(TRANG_THAI_KHOA_HOC_LABEL).map(([key, label]) => ({
				text: label,
				value: key,
			})),
			onFilter: (value, row) => row.trangThai === value,
			render: (val: ETrangThaiKhoaHoc) => (
				<Tag color={TRANG_THAI_KHOA_HOC_COLOR[val]}>{TRANG_THAI_KHOA_HOC_LABEL[val]}</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (_, row: IKhoaHoc.IRecord) => (
				<Space>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setRecord(row);
							setEdit(true);
							setVisibleForm(true);
						}}
						title='Chỉnh sửa'
					/>
					{row.soHocVien === 0 ? (
						<Popconfirm
							onConfirm={() => {
								deleteModel(row._id, getModel);
							}}
							title='Bạn có chắc chắn muốn xóa khóa học này?'
							okText='Xóa'
							cancelText='Hủy'
							okButtonProps={{ danger: true }}
						>
							<Button
								type='link'
								danger
								icon={<DeleteOutlined />}
								title='Xóa'
							/>
						</Popconfirm>
					) : (
						<Button
							type='link'
							danger
							icon={<DeleteOutlined />}
							disabled
							title={`Không thể xóa (có ${row.soHocVien} học viên)`}
						/>
					)}
				</Space>
			),
		},
	];

	return (
		<Card title='Quản lý Khóa học Online' bordered>
			<Space wrap style={{ marginBottom: 12 }}>
				<Input.Search
					allowClear
					placeholder='Tìm kiếm theo tên khóa học'
					style={{ width: 320 }}
					onChange={(e) => setSearchKeyword(e.target.value)}
				/>
				<Button
					onClick={() => {
						setRecord({} as IKhoaHoc.IRecord);
						setEdit(false);
						setVisibleForm(true);
					}}
					icon={<PlusCircleOutlined />}
					type='primary'
				>
					Thêm mới khóa học
				</Button>
			</Space>

			{visibleForm && (
				<FormKTGK__KhoaHoc
					record={selectedRecord}
					setVisibleForm={setVisibleForm}
					edit={edit}
					postModel={postModel}
					putModel={putModel}
					formSubmiting={formSubmiting}
					visibleForm={visibleForm}
					getModel={getModel}
				/>
			)}

			<Table
				columns={columns}
				dataSource={filteredDanhSach}
				loading={loading}
				pagination={{ pageSize: limit, total: filteredDanhSach?.length || 0, current: 1 }}
				rowKey='_id'
				scroll={{ x: 1200 }}
			/>
		</Card>
	);
};

export default KTGK__DanhSachKhoaHoc;
