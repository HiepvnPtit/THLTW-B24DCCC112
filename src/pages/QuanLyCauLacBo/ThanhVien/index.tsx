import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { RetweetOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const ThanhVienCauLacBoPage = () => {
	const {
		page,
		limit,
		selectedIds,
		setSelectedIds,
		setCondition,
		loading,
		danhMucCauLacBo,
		getDanhSachThanhVien,
		doiClbThanhVienHangLoat,
	} = useModel('clb' as any) as any;
	const [visibleDoiClb, setVisibleDoiClb] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		setCondition({ view: 'member' });
	}, []);

	useEffect(() => {
		if (!visibleDoiClb) form.resetFields();
	}, [visibleDoiClb]);

	const getDataThanhVien = () => getDanhSachThanhVien();

	const danhSachClbOptions = useMemo(
		() =>
			(danhMucCauLacBo || []).map((item: any) => ({
				label: `${item.tenClb} (${item.trangThai === 'active' ? 'Mở' : 'Đóng'})`,
				value: item.id,
			})),
		[danhMucCauLacBo],
	);

	const submitDoiClb = async () => {
		try {
			const values = await form.validateFields();
			doiClbThanhVienHangLoat(selectedIds || [], values.idCauLacBo);
			setVisibleDoiClb(false);
			setSelectedIds(undefined);
			form.resetFields();
			getDataThanhVien();
		} catch (error) {
			console.log(error);
		}
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTenUngVien',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 220,
			filterType: 'string',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			width: 130,
			filterType: 'string',
		},
		{ title: 'Giới tính', dataIndex: 'gioiTinh', width: 100, filterType: 'select', filterData: ['Nam', 'Nữ', 'Khác'] },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', width: 180, filterType: 'string' },
		{ title: 'Sở trường', dataIndex: 'soTruong', width: 160, filterType: 'string' },
		{
			title: 'CLB hiện tại',
			dataIndex: 'tenCauLacBo',
			width: 220,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: () => <Tag color='green'>Approved</Tag>,
		},
		{
			title: 'Ngày tạo đơn',
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
	];

	const selectedCount = selectedIds?.length ?? 0;

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='clb'
				title='Thành viên câu lạc bộ (đã duyệt)'
				buttons={{ create: false }}
				getData={getDataThanhVien}
				rowSelection
				otherProps={{ rowKey: 'id' }}
				otherButtons={[
					<Button
						key='doi-clb-hang-loat'
						type='primary'
						icon={<RetweetOutlined />}
						disabled={!selectedCount || loading}
						onClick={() => setVisibleDoiClb(true)}
					>
						Đổi CLB hàng loạt ({selectedCount})
					</Button>,
				]}
			/>

			<Modal
				title={`Đổi câu lạc bộ cho ${selectedCount} thành viên`}
				visible={visibleDoiClb}
				onCancel={() => setVisibleDoiClb(false)}
				onOk={submitDoiClb}
				okText='Xác nhận'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='idCauLacBo'
						label='Câu lạc bộ mới'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
					>
						<Select options={danhSachClbOptions} placeholder='Chọn câu lạc bộ' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ThanhVienCauLacBoPage;
