
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Popconfirm ,message} from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import queryString from 'query-string';
import Search from 'antd/lib/transfer/search';
import title from '@/locales/vi-VN/global/title';
import { render } from 'react-dom';
import { values } from 'lodash';
// import message from '@/locales/vi-VN/global/message';



const TableSP = () => {
	const { danhSachSanPham, setDanhSachSanPham } = useModel('danhsachsanpham');
	const [isVisible, setIsVisible] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState<string>('');

	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<any>(null);
	const [form] = Form.useForm();
	const columns = [
		{ title: ' ID', dataIndex: 'id', key: 'id', align: 'center', },
		{
			title: 'Tên Sản Phẩm',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'center',
		},
		{
			title: 'Số Lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
		},
		{
			title: 'Hành Động',
			key: 'action',
			align: 'center',
			render: (_: any, record: any) => (
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
							const filteredData = danhSachSanPham.filter((item: any) => item.id !== record.id);
							setDanhSachSanPham(filteredData);
							message.success('Xóa sản phẩm thành công');
						}}
						
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
					
				</Space>
			),
		},
	];

	const dataHienThi = danhSachSanPham.filter((item: any) =>
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
					initialValues={isEdit ? row : {}}
					onFinish={(values) => {
						if (isEdit) {
							const updatedList = danhSachSanPham.map((item: any) =>
								item.id === row.id ? { ...item, ...values } : item
							);
							setDanhSachSanPham(updatedList);
							message.success('Cập nhật sản phẩm thành công');
						}
						else {
							const newProduct = {
								id: danhSachSanPham.length + 1,
								...values,
							};
							setDanhSachSanPham([...danhSachSanPham, newProduct]);
							message.success('Thêm sản phẩm thành công');
						}
						setVisible(false);
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
						name="price"
						label="Giá"
						rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
					>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name="quantity"
						label="Số Lượng"
						rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm' }]}
					>
						<InputNumber style={{ width: '100%' }} />
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