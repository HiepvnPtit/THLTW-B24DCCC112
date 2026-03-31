import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import TinyEditor from '@/components/TinyEditor';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Image, Input, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhSachCauLacBoPage = () => {
	const {
		page,
		limit,
		setCondition,
		getDanhSachCauLacBo,
		addCauLacBo,
		updateCauLacBo,
		deleteCauLacBo,
		danhMucCauLacBo,
		getThanhVienTheoClb,
	} = useModel('clb' as any) as any;
	const [visibleModal, setVisibleModal] = useState(false);
	const [visibleThanhVien, setVisibleThanhVien] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedClb, setSelectedClb] = useState<any>();
	const [form] = Form.useForm();

	useEffect(() => {
		setCondition({ view: 'club' });
	}, []);

	const getData = () => getDanhSachCauLacBo();

	useEffect(() => {
		if (!visibleModal) {
			form.resetFields();
			return;
		}

		if (editingId) {
			const record = (danhMucCauLacBo || []).find((item: any) => item.id === editingId);
			if (record) {
				form.setFieldsValue({
					...record,
					moTaHtml: record.moTaHtml ?? record.moTa ?? '',
					ngayThanhLap: record.ngayThanhLap ? moment(record.ngayThanhLap) : undefined,
				});
			}
		} else {
			form.resetFields();
			form.setFieldsValue({ hoatDong: true });
		}
	}, [visibleModal, editingId, danhMucCauLacBo]);

	const openCreate = () => {
		setEditingId(null);
		setVisibleModal(true);
	};

	const openEdit = (record: any) => {
		setEditingId(record.id);
		setVisibleModal(true);
	};

	const onFinish = async () => {
		const values = await form.validateFields();
		const payload = {
			...values,
			ngayThanhLap: values.ngayThanhLap?.toISOString(),
			hoatDong: values.hoatDong,
		};
		if (editingId) {
			const old = (danhMucCauLacBo || []).find((item: any) => item.id === editingId);
			if (!old) return;
			updateCauLacBo({ ...old, ...payload });
		} else {
			addCauLacBo(payload);
		}
		setVisibleModal(false);
		getData();
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			width: 120,
			align: 'center',
			render: (val) => (val ? <Image src={val} width={44} height={44} style={{ borderRadius: 8 }} /> : '--'),
		},
		{
			title: 'Tên CLB',
			dataIndex: 'tenClb',
			width: 220,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 150,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '--'),
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTaHtml',
			width: 260,
			filterType: 'string',
			render: (val, rec) => {
				const html = val || rec?.moTa || '';
				return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : '--';
			},
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Số đơn',
			dataIndex: 'soHienTai',
			width: 90,
			align: 'center',
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'tongLuotTraCuu',
			width: 120,
			align: 'center',
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 180,
			render: (record) => (
				<Space size={0}>
					<Button
						type='link'
						icon={<TeamOutlined />}
						onClick={() => {
							setSelectedClb(record);
							setVisibleThanhVien(true);
						}}
					/>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEdit(record)} />
					<Popconfirm title='Xóa CLB này?' onConfirm={() => deleteCauLacBo(record.id)}>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<TableBase
				title='Danh sách CLB (localStorage)'
				columns={columns}
				modelName='clb'
				dependencies={[page, limit]}
				getData={getData}
				buttons={{ create: false }}
				otherButtons={[
					<Button key='create' type='primary' icon={<PlusCircleOutlined />} onClick={openCreate}>
						Thêm CLB
					</Button>,
				]}
			/>

			<Modal
				title={editingId ? 'Cập nhật CLB' : 'Thêm CLB'}
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={onFinish}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='tenClb' label='Tên CLB' rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='anhDaiDien' label='Ảnh đại diện (URL)'>
						<Input placeholder='https://...' />
					</Form.Item>
					<Form.Item
						name='ngayThanhLap'
						label='Ngày thành lập'
						rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
					>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item name='chuNhiem' label='Chủ nhiệm' rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='moTaHtml' label='Mô tả (HTML)'>
						<TinyEditor height={220} miniToolbar hideMenubar />
					</Form.Item>
					<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked'>
						<Switch checkedChildren='Có' unCheckedChildren='Không' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={`Thành viên CLB: ${selectedClb?.tenClb || ''}`}
				visible={visibleThanhVien}
				onCancel={() => setVisibleThanhVien(false)}
				footer={null}
				width={900}
			>
				<Table
					rowKey='id'
					pagination={{ pageSize: 8 }}
					dataSource={selectedClb?.id ? getThanhVienTheoClb(selectedClb.id) : []}
					columns={[
						{ title: 'Họ tên', dataIndex: 'hoTenUngVien' },
						{ title: 'Email', dataIndex: 'email' },
						{ title: 'SĐT', dataIndex: 'soDienThoai' },
						{ title: 'Giới tính', dataIndex: 'gioiTinh' },
						{ title: 'Địa chỉ', dataIndex: 'diaChi' },
						{
							title: 'Ngày duyệt',
							dataIndex: 'updatedAt',
							render: (val: string) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
						},
					]}
				/>
			</Modal>
		</>
	);
};

export default DanhSachCauLacBoPage;
