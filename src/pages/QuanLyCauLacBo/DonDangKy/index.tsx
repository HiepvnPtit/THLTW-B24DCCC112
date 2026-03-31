import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const mapTrangThaiColor: Record<string, string> = {
	Pending: 'gold',
	Approved: 'green',
	Rejected: 'red',
};

const DonDangKyCauLacBoPage = () => {
	const {
		page,
		limit,
		selectedIds,
		setSelectedIds,
		setCondition,
		getDanhSachDonDangKy,
		addDonDangKy,
		updateDonDangKy,
		deleteDonDangKy,
		duyetDonDangKy,
		tuChoiDonDangKy,
		danhMucCauLacBo,
		danhMucDonDangKy,
		lichSuThaoTac,
	} = useModel('clb' as any) as any;

	const [visibleCreate, setVisibleCreate] = useState(false);
	const [visibleReject, setVisibleReject] = useState(false);
	const [visibleHistory, setVisibleHistory] = useState(false);
	const [editingRecord, setEditingRecord] = useState<any>();
	const [isViewMode, setIsViewMode] = useState(false);
	const [targetRejectIds, setTargetRejectIds] = useState<string[]>([]);
	const [createForm] = Form.useForm();
	const [rejectForm] = Form.useForm();

	useEffect(() => {
		setCondition({ view: 'registration' });
	}, []);

	useEffect(() => {
		if (!visibleCreate) {
			createForm.resetFields();
			setEditingRecord(undefined);
			setIsViewMode(false);
			return;
		}

		if (editingRecord?.id) {
			const latestRecord = (danhMucDonDangKy || []).find((item: any) => item.id === editingRecord.id) || editingRecord;
			createForm.setFieldsValue(latestRecord);
		}
	}, [visibleCreate, editingRecord, danhMucDonDangKy]);

	useEffect(() => {
		if (!selectedIds?.length) return;
		const pendingIds = (danhMucDonDangKy || [])
			.filter((item: any) => item.trangThai === 'Pending')
			.map((item: any) => item.id);
		const validSelected = selectedIds.filter((id: string) => pendingIds.includes(id));
		if (validSelected.length !== selectedIds.length) {
			setSelectedIds(validSelected.length ? validSelected : undefined);
		}
	}, [danhMucDonDangKy]);

	useEffect(() => {
		if (!visibleReject) {
			rejectForm.resetFields();
			setTargetRejectIds([]);
		}
	}, [visibleReject]);

	const getData = () => getDanhSachDonDangKy();

	const clbOptions = useMemo(
		() =>
			(danhMucCauLacBo || []).map((item: any) => ({
				label: `${item.tenClb} (${item.trangThai === 'active' ? 'Mở' : 'Đóng'})`,
				value: item.id,
			})),
		[danhMucCauLacBo],
	);

	const moModalTuChoi = (ids: string[]) => {
		setTargetRejectIds(ids);
		setVisibleReject(true);
	};

	const handleCreate = async () => {
		const values = await createForm.validateFields();
		if (editingRecord) updateDonDangKy({ ...editingRecord, ...values });
		else addDonDangKy(values);
		setVisibleCreate(false);
		createForm.resetFields();
		getData();
	};

	const handleDuyet = (ids: string[]) => {
		duyetDonDangKy(ids);
		setSelectedIds(undefined);
		getData();
	};

	const handleTuChoi = async () => {
		const values = await rejectForm.validateFields();
		tuChoiDonDangKy(targetRejectIds, values.lyDoTuChoi);
		setVisibleReject(false);
		setSelectedIds(undefined);
		setTargetRejectIds([]);
		getData();
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Số TT',
			dataIndex: 'soThuTu',
			width: 90,
			align: 'center',
		},
		{
			title: 'Họ tên ứng viên',
			dataIndex: 'hoTenUngVien',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{ title: 'Email', dataIndex: 'email', width: 200, filterType: 'string' },
		{ title: 'SĐT', dataIndex: 'soDienThoai', width: 130, filterType: 'string' },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 100, filterType: 'select', filterData: ['Nam', 'Nữ', 'Khác'] },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', width: 180, filterType: 'string' },
		{ title: 'Sở trường', dataIndex: 'soTruong', width: 160, filterType: 'string' },
		{ title: 'CLB', dataIndex: 'tenCauLacBo', width: 180, filterType: 'string' },
		{ title: 'Lý do đăng ký', dataIndex: 'lyDoDangKy', width: 220, filterType: 'string' },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={mapTrangThaiColor[val] || 'default'}>{val}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val) => val || '--',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 240,
			fixed: 'right',
			render: (record) => (
				<Space size={4}>
					<Button
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							setEditingRecord(record);
							setIsViewMode(true);
							setVisibleCreate(true);
						}}
					/>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingRecord(record);
							setIsViewMode(false);
							setVisibleCreate(true);
						}}
					/>
					<Popconfirm title='Xóa đơn này?' onConfirm={() => deleteDonDangKy(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
					<Popconfirm
						title='Duyệt đơn này?'
						onConfirm={() => handleDuyet([record.id])}
						disabled={record.trangThai !== 'Pending'}
					>
						<Button type='link' icon={<CheckOutlined />} disabled={record.trangThai !== 'Pending'}>
							Duyệt
						</Button>
					</Popconfirm>
					<Button
						type='link'
						danger
						icon={<CloseOutlined />}
						disabled={record.trangThai !== 'Pending'}
						onClick={() => moModalTuChoi([record.id])}
					>
						Từ chối
					</Button>
				</Space>
			),
		},
	];

	const selectedCount = selectedIds?.length ?? 0;

	return (
		<>
			<TableBase
				title='Đơn đăng ký CLB (localStorage)'
				columns={columns}
				modelName='clb'
				dependencies={[page, limit, lichSuThaoTac?.length || 0]}
				getData={getData}
				buttons={{ create: false }}
				rowSelection
				otherProps={{ rowKey: 'id' }}
				otherButtons={[
					<Button
						key='create'
						type='primary'
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setEditingRecord(undefined);
							setIsViewMode(false);
							setVisibleCreate(true);
						}}
					>
						Tạo đơn
					</Button>,
					<Button
						key='approve-many'
						type='primary'
						disabled={!selectedCount}
						onClick={() => handleDuyet(selectedIds || [])}
					>
						Duyệt hàng loạt ({selectedCount})
					</Button>,
					<Button
						key='reject-many'
						danger
						disabled={!selectedCount}
						onClick={() => moModalTuChoi(selectedIds || [])}
					>
						Từ chối hàng loạt ({selectedCount})
					</Button>,
					<Button key='history' onClick={() => setVisibleHistory(true)}>
						Xem lịch sử thao tác
					</Button>,
				]}
			/>

			<Modal
				title={isViewMode ? 'Chi tiết đơn đăng ký' : editingRecord ? 'Cập nhật đơn đăng ký' : 'Tạo đơn đăng ký'}
				visible={visibleCreate}
				onCancel={() => setVisibleCreate(false)}
				onOk={isViewMode ? () => setVisibleCreate(false) : handleCreate}
				okText={isViewMode ? 'Đóng' : 'Lưu'}
				cancelText='Hủy'
			>
				<Form form={createForm} layout='vertical'>
					<Form.Item
						name='hoTenUngVien'
						label='Họ tên ứng viên'
						rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
					>
						<Input disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='email' label='Email' rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
						<Input disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='soDienThoai' label='Số điện thoại'>
						<Input disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='gioiTinh' label='Giới tính'>
						<Select disabled={isViewMode} options={[{ value: 'Nam' }, { value: 'Nữ' }, { value: 'Khác' }]} />
					</Form.Item>
					<Form.Item name='diaChi' label='Địa chỉ'>
						<Input disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='soTruong' label='Sở trường'>
						<Input disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='lyDoDangKy' label='Lý do đăng ký'>
						<Input.TextArea rows={3} disabled={isViewMode} />
					</Form.Item>
					<Form.Item name='idCauLacBo' label='Câu lạc bộ' rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
						<Select disabled={isViewMode} options={clbOptions} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={targetRejectIds.length > 1 ? 'Từ chối hàng loạt' : 'Từ chối đơn'}
				visible={visibleReject}
				onCancel={() => setVisibleReject(false)}
				onOk={handleTuChoi}
				okText='Xác nhận từ chối'
				cancelText='Hủy'
			>
				<Form form={rejectForm} layout='vertical'>
					<Form.Item
						name='lyDoTuChoi'
						label='Lý do từ chối'
						rules={[{ required: true, message: 'Bắt buộc nhập lý do từ chối' }]}
					>
						<Input.TextArea rows={4} maxLength={500} showCount />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Lịch sử thao tác'
				visible={visibleHistory}
				onCancel={() => setVisibleHistory(false)}
				footer={null}
				width={1000}
			>
				<Table
					rowKey='id'
					pagination={{ pageSize: 8 }}
					dataSource={lichSuThaoTac || []}
					columns={[
						{ title: 'Thời gian', dataIndex: 'thoiGian', render: (v: string) => moment(v).format('HH:mm DD/MM/YYYY') },
						{ title: 'Admin', dataIndex: 'admin' },
						{ title: 'Hành động', dataIndex: 'action' },
						{ title: 'ID Đơn', dataIndex: 'donDangKyId' },
						{ title: 'Lý do/Ghi chú', dataIndex: 'lyDo', render: (v: string) => v || '--' },
					]}
				/>
			</Modal>
		</>
	);
};

export default DonDangKyCauLacBoPage;
