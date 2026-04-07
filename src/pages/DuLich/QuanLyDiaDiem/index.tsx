import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Rate, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { Destination, DestinationType } from '@/services/dulich';
import { tienVietNam } from '@/utils/utils';

const { Title, Text } = Typography;

const destinationTypeOptions: { label: string; value: DestinationType }[] = [
	{ label: 'Biển', value: 'bien' },
	{ label: 'Núi', value: 'nui' },
	{ label: 'Thành phố', value: 'thanh-pho' },
	{ label: 'Văn hóa', value: 'van-hoa' },
	{ label: 'Sinh thái', value: 'sinh-thai' },
];

const QuanLyDiaDiemPage = () => {
	const { destinations, addDestination, updateDestination, deleteDestination } = useModel('dulich' as any) as any;
	const [visible, setVisible] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			setEditingId(null);
			return;
		}

		if (editingId) {
			const record = (destinations || []).find((item: Destination) => item.id === editingId);
			if (record) {
				form.setFieldsValue(record);
			}
		} else {
			form.setFieldsValue({
				rating: 4.5,
				visitTime: 2,
				avgCosts: { food: 300000, stay: 800000, transport: 400000 },
			});
		}
	}, [editingId, form, visible, destinations]);

	const totalDestinations = destinations.length;
	const avgRating = useMemo(() => (destinations.length ? destinations.reduce((sum: number, item: Destination) => sum + item.rating, 0) / destinations.length : 0), [destinations]);

	const columns = [
		{
			title: 'Ảnh',
			dataIndex: 'imageUrl',
			width: 120,
			render: (value: string) => (
				<img
					alt='destination'
					src={value}
					style={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 10 }}
				/>
			),
		},
		{ title: 'Tên điểm đến', dataIndex: 'name', width: 180 },
		{
			title: 'Loại hình',
			dataIndex: 'type',
			width: 120,
			render: (value: DestinationType) => <Tag color='blue'>{value}</Tag>,
		},
		{ title: 'Địa điểm', dataIndex: 'location', width: 150 },
		{
			title: 'Rating',
			dataIndex: 'rating',
			width: 110,
			render: (value: number) => <Rate disabled allowHalf value={value} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Tổng chi phí',
			width: 150,
			render: (_: unknown, record: Destination) => tienVietNam(record.avgCosts.food + record.avgCosts.stay + record.avgCosts.transport),
		},
		{
			title: 'Thời gian',
			dataIndex: 'visitTime',
			width: 100,
			render: (value: number) => `${value} ngày`,
		},
		{
			title: 'Thao tác',
			width: 160,
			render: (_: unknown, record: Destination) => (
				<Space>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingId(record.id);
							setVisible(true);
						}}
					/>
					<Popconfirm
						title='Xóa điểm đến này?'
						onConfirm={() => {
							deleteDestination(record.id);
							message.success('Xóa điểm đến thành công');
						}}
					>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const onFinish = async () => {
		const values = await form.validateFields();
		const payload = {
			...values,
			rating: Number(values.rating || 0),
			visitTime: Number(values.visitTime || 1),
			avgCosts: {
				food: Number(values?.avgCosts?.food || 0),
				stay: Number(values?.avgCosts?.stay || 0),
				transport: Number(values?.avgCosts?.transport || 0),
			},
		};

		if (editingId) {
			updateDestination(editingId, payload);
			message.success('Cập nhật điểm đến thành công');
		} else {
			addDestination(payload);
			message.success('Thêm điểm đến thành công');
		}

		setVisible(false);
		form.resetFields();
	};

	return (
		<Card
			title={<Title level={4} style={{ margin: 0 }}>Quản lý điểm đến</Title>}
			extra={
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingId(null);
						setVisible(true);
					}}
				>
					Thêm điểm đến
				</Button>
			}
		>
			<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={8}>
					<Card>
						<Title level={5} style={{ marginTop: 0 }}>Tổng điểm đến</Title>
						<Text strong style={{ fontSize: 24 }}>{totalDestinations}</Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Title level={5} style={{ marginTop: 0 }}>Rating trung bình</Title>
						<Text strong style={{ fontSize: 24 }}>{avgRating.toFixed(1)}</Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Title level={5} style={{ marginTop: 0 }}>Điểm đến nổi bật</Title>
						<Text strong style={{ fontSize: 24 }}>{(destinations[0]?.name || '--').slice(0, 18)}</Text>
					</Card>
				</Col>
			</Row>

			<Table
				rowKey='id'
				columns={columns as any}
				dataSource={destinations}
				scroll={{ x: 1100 }}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={onFinish}
				width={820}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}>
								<Input placeholder='Ví dụ: Phú Quốc' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='type' label='Loại hình' rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}>
								<Select options={destinationTypeOptions} placeholder='Chọn loại hình' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='location' label='Địa điểm' rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
								<Input placeholder='Ví dụ: Kiên Giang' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='imageUrl' label='URL hình ảnh' rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
								<Input placeholder='https://...' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='rating' label='Rating' rules={[{ required: true, message: 'Vui lòng nhập rating' }]}>
								<InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='visitTime' label='Thời gian tham quan (ngày)' rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan' }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col xs={24} md={8}>
							<Form.Item name={['avgCosts', 'food']} label='Chi phí ăn uống'>
								<InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name={['avgCosts', 'stay']} label='Chi phí lưu trú'>
								<InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name={['avgCosts', 'transport']} label='Chi phí di chuyển'>
								<InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<Input.TextArea rows={4} placeholder='Mô tả điểm đến...' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyDiaDiemPage;
