
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Popconfirm, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import queryString from 'query-string';
import Search from 'antd/lib/transfer/search';
import title from '@/locales/vi-VN/global/title';
import { render } from 'react-dom';
import { values } from 'lodash';
import type {  Product } from '@/models/danhsachsanpham';
// import message from '@/locales/vi-VN/global/message';
const renderStatus = (quantity: number) => {
    if (quantity > 10) return <Tag color="success">Còn hàng</Tag>;
    if (quantity > 0) return <Tag color="warning">Sắp hết hàng</Tag>;
    return <Tag color="error">Hết hàng</Tag>;
  };


const TableSP = () => {
	const { danhSachSanPham, setDanhSachSanPham, addSanPham , deleteSanPham } = useModel('danhsachsanpham');
	const [stt, setStt] = useState(1);
	const [isVisible, setIsVisible] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState<string>('');

	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Product | null>(null);
	const [form] = Form.useForm<Product>();

	const columns = [
		{
			title: 'STT', 
			dataIndex: 'stt', 
			key: 'stt', 
			align: 'center',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên Sản Phẩm',
			dataIndex: 'name',
			key: 'name',
			align: 'center' as const,
		},
		{
			title: 'Danh Mục',
			dataIndex: 'category',
			key: 'category',
			align: 'center' as const,
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'center' as const,
		},
		{
			title: 'Số lượng tồn kho',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as const,
			
			render: (_: any, record: Product) => (
				renderStatus(record.quantity)
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: Product) => (
				<Space size="middle">
					<Button
						onClick={() => {
							setIsEdit(true);
							setRow(record);
							setVisible(true);
							form.setFieldsValue(record);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa sản phẩm này?"
						onConfirm={() => {
							deleteSanPham(record.id);
							message.success('Xóa sản phẩm thành công');
						}}

					>
						<Button danger>Xóa</Button>
					</Popconfirm>

				</Space>
			),
		},
	];

	const dataHienThi = danhSachSanPham.filter((item: Product) =>
		item.name.toLowerCase().includes(searchKeyword.toLowerCase())
	);

	return (
		<div>
			<Button
				type="primary"
				onClick={() => {
					setIsEdit(false);
					setRow(null);
					setVisible(true);
				}}
			>
				Thêm Sản Phẩm
			</Button>
			<Input
				placeholder="Tìm kiếm sản phẩm theo tên..."
				style={{ width: 300 }}
				allowClear
				onChange={(e) => setSearchKeyword(e.target.value)}
			/>

			<Table style={{ textAlign: 'center' }} columns={columns} dataSource={dataHienThi} rowKey="id" />
			<Modal
				title={isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
				visible={visible}
				footer={null}
				onCancel={() => setVisible(false)}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={(values) => {
						if (isEdit && row) {
							const updatedData = danhSachSanPham.map((item: Product) =>
								item.id === row.id ? { ...item, ...values } : item
							);
							setDanhSachSanPham(updatedData);
							message.success('Cập nhật sản phẩm thành công');
						} else {
							addSanPham(values as Product);
							message.success('Thêm sản phẩm thành công');
						}
						setVisible(false);
						form.resetFields();
					}}
				>
					<Form.Item
						name="name"
						label="Tên Sản Phẩm"
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="category"
						label="Danh Mục"
						rules={[{ required: true, message: 'Vui lòng nhập danh mục sản phẩm' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="price"
						label="Giá"
						rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' },
						{ required: true, type: 'integer', min: 0, message: 'Giá phải là số không âm' }
						]}
					>
						<InputNumber style={{ width: '100%' }} min={0} precision={0} />

					</Form.Item>
					<Form.Item
						name="quantity"
						label="Số Lượng"
						rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm' },
						{ required: true, type: 'integer', min: 0, message: 'Số lượng phải là số không âm' }
						]}
					>
						<InputNumber style={{ width: '100%' }} min={0} precision={0} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TableSP;