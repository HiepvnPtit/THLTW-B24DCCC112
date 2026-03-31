import { useState, useMemo } from 'react';
import {
	Button, Form, Input, Modal, Select, Space, Table, Tag, Card,
	Typography, DatePicker, TimePicker, message, Tooltip, Row, Col, Rate
} from 'antd';
import {
	PlusOutlined,
	CalendarOutlined,
	LeftOutlined,
	RightOutlined,
	ClockCircleOutlined,
	StarOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const HOUR_HEIGHT = 80;
const START_HOUR = 8;
const END_HOUR = 20;

const QuanLyLichHen = () => {
	const { datLichHen, addDatLichHen, updateDatLichHen, nhanVienThucHien, dichVuCaToc } = useModel('dichvucattoc');

	const [visible, setVisible] = useState(false);
	const [calVisible, setCalVisible] = useState(false);
	const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
	const [rateVisible, setRateVisible] = useState(false);
	const [selectedLichHen, setSelectedLichHen] = useState<any>(null);
	const { addDanhGiaKhachHang } = useModel('dichvucattoc');
	const [form] = Form.useForm();
	const [formRate] = Form.useForm();



	const checkConflict = (values: any) => {
		const { ngayHen, thoiGianBatDau, nhanVienId, dichVuId } = values;
		const dateStr = ngayHen.format('YYYY-MM-DD');
		const startTime = thoiGianBatDau.format('HH:mm');
		const dv = dichVuCaToc.find(d => d.id === dichVuId);
		const duration = Number(dv?.thoiGianThucHien || 30);
		const endTime = thoiGianBatDau.clone().add(duration, 'minutes').format('HH:mm');

		const nv = nhanVienThucHien.find(n => n.id === nhanVienId);
		const bookingsInDay = datLichHen.filter(b => b.nhanVienId === nhanVienId && b.ngayHen === dateStr && b.trangThai !== 'Hủy');

		if (bookingsInDay.length >= (nv?.gioiHanKhachHang || 0)) {
			return `Nhân viên ${nv?.tenNhanVien} đã hết chỗ trong ngày (${nv?.gioiHanKhachHang} khách).`;
		}

		const isOverlapping = datLichHen.some(b => {
			if (b.nhanVienId !== nhanVienId || b.ngayHen !== dateStr || b.trangThai === 'Hủy') return false;
			return (startTime < b.thoiGianKetThuc && endTime > b.thoiGianBatDau);
		});

		if (isOverlapping) return "Khung giờ này nhân viên đã có lịch hẹn khác!";
		return null;
	};

	const onHandleOk = async () => {
		try {
			const values = await form.validateFields();
			const errorMsg = checkConflict(values);
			if (errorMsg) {
				message.error(errorMsg);
				return;
			}

			const dv = dichVuCaToc.find(d => d.id === values.dichVuId);
			const payload = {
				...values,
				ngayHen: values.ngayHen.format('YYYY-MM-DD'),
				thoiGianBatDau: values.thoiGianBatDau.format('HH:mm'),
				thoiGianKetThuc: values.thoiGianBatDau.clone().add(Number(dv?.thoiGianThucHien), 'minutes').format('HH:mm'),
				trangThai: 'Chờ duyệt'
			};

			addDatLichHen(payload);
			message.success('Đặt lịch mới thành công!');
			setVisible(false);
			form.resetFields();
		} catch (e) { console.log(e); }
	};



	const daysInWeek = useMemo(() => {
		return Array.from({ length: 7 }).map((_, i) => moment(currentWeek).add(i, 'days'));
	}, [currentWeek]);

	const timeSlots = Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) =>
		(i + START_HOUR).toString().padStart(2, '0') + ':00'
	);

	const calculateTop = (timeStr: string) => {
		const [hour, minute] = timeStr.split(':').map(Number);
		const totalMinutes = (hour - START_HOUR) * 60 + minute;
		return (totalMinutes / 60) * HOUR_HEIGHT;
	};

	const calculateHeight = (start: string, end: string) => {
		const [h1, m1] = start.split(':').map(Number);
		const [h2, m2] = end.split(':').map(Number);
		const duration = (h2 * 60 + m2) - (h1 * 60 + m1);
		return (duration / 60) * HOUR_HEIGHT;
	};

	const renderWeeklyCalendar = () => (
		<div style={{ userSelect: 'none' }}>

			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center', background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
				<Button icon={<LeftOutlined />} onClick={() => setCurrentWeek(moment(currentWeek).subtract(1, 'weeks'))}>Tuần trước</Button>
				<Title level={4} style={{ margin: 0 }}>
					<CalendarOutlined /> {daysInWeek[0].format('DD/MM')} - {daysInWeek[6].format('DD/MM/YYYY')}
				</Title>
				<Button onClick={() => setCurrentWeek(moment(currentWeek).add(1, 'weeks'))}>Tuần sau <RightOutlined /></Button>
			</div>


			<div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>

				<div style={{ display: 'flex', marginLeft: 60, background: '#fafafa', borderBottom: '2px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 10 }}>
					{daysInWeek.map(day => (
						<div key={day.format()} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRight: '1px solid #e8e8e8' }}>
							<div style={{ fontWeight: 'bold', color: day.isSame(moment(), 'day') ? '#1890ff' : '#333' }}>{day.format('dddd')}</div>
							<small style={{ color: '#888' }}>{day.format('DD/MM')}</small>
						</div>
					))}
				</div>


				<div style={{ height: '550px', overflowY: 'auto', position: 'relative', background: '#fff' }}>
					<div style={{ display: 'flex', position: 'relative' }}>

						<div style={{ width: 60, background: '#fafafa', borderRight: '1px solid #e8e8e8' }}>
							{timeSlots.map(slot => (
								<div key={slot} style={{ height: HOUR_HEIGHT, textAlign: 'center', padding: '5px 0', fontSize: '12px', color: '#999', borderBottom: '1px dashed #eee' }}>
									{slot}
								</div>
							))}
						</div>


						{daysInWeek.map(day => {
							const dateStr = day.format('YYYY-MM-DD');
							const appointments = datLichHen.filter(a => a.ngayHen === dateStr && a.trangThai !== 'Hủy');

							return (
								<div key={dateStr} style={{ flex: 1, position: 'relative', borderRight: '1px solid #f0f0f0' }}>

									{timeSlots.map(slot => (
										<div key={slot} style={{ height: HOUR_HEIGHT, borderBottom: '1px solid #f0f0f0' }} />
									))}


									{appointments.map(app => {
										const top = calculateTop(app.thoiGianBatDau);
										const height = calculateHeight(app.thoiGianBatDau, app.thoiGianKetThuc);
										const dv = dichVuCaToc.find(d => d.id === app.dichVuId);
										const nv = nhanVienThucHien.find(n => n.id === app.nhanVienId);

										return (
											<Tooltip key={app.id} title={`${app.thoiGianBatDau}-${app.thoiGianKetThuc} | ${dv?.tenDichVu} | NV: ${nv?.tenNhanVien}`}>
												<div style={{
													position: 'absolute',
													top: top + 2,
													left: 4,
													right: 4,
													height: height - 4,
													backgroundColor: app.trangThai === 'Hoàn thành' ? '#e6f7ff' : '#fff7e6',
													borderLeft: `4px solid ${app.trangThai === 'Hoàn thành' ? '#1890ff' : '#ffa940'}`,
													borderRadius: '4px',
													padding: '4px',
													fontSize: '11px',
													zIndex: 5,
													boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
													overflow: 'hidden',
													cursor: 'pointer'
												}}>
													<div style={{ fontWeight: 'bold', color: '#333' }}>{app.sdt.slice(-4)} - {dv?.tenDichVu}</div>
													<div style={{ color: '#666' }}>{nv?.tenNhanVien.split(' ').pop()}</div>
												</div>
											</Tooltip>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);



	const columns = [
		{ title: 'SĐT Khách', dataIndex: 'sdt', key: 'sdt' },
		{ title: 'Dịch vụ', dataIndex: 'dichVuId', render: (id: number) => dichVuCaToc.find(d => d.id === id)?.tenDichVu },
		{ title: 'Nhân viên', dataIndex: 'nhanVienId', render: (id: number) => nhanVienThucHien.find(n => n.id === id)?.tenNhanVien },
		{ title: 'Thời gian', render: (_: any, r: any) => `${r.ngayHen} (${r.thoiGianBatDau})` },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			render: (t: string) => <Tag color={t === 'Hoàn thành' ? 'green' : t === 'Hủy' ? 'red' : 'gold'}>{t.toUpperCase()}</Tag>
		},
		{
			title: 'Cập nhật',
			render: (_: any, record: any) => (
				<Select
					value={record.trangThai}
					size="small"
					style={{ width: 120 }}
					onChange={(val) => updateDatLichHen(record.id, { trangThai: val })}
				>
					<Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
					<Select.Option value="Xác nhận">Xác nhận</Select.Option>
					<Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
					<Select.Option value="Hủy">Hủy</Select.Option>
				</Select>
			)
		},
		{
			title: 'Đánh giá',
			render: (_: any, record: any) => (
				record.trangThai === 'Hoàn thành' && (
					<Button
						type="link"
						size="small"
						icon={<StarOutlined />}
						onClick={() => { setSelectedLichHen(record); setRateVisible(true); }}
					>
						Đánh giá
					</Button>
				)
			)
		}
	];

	return (
		<Card
			title={<Title level={4}><ClockCircleOutlined /> QUẢN LÝ ĐẶT LỊCH HẸN</Title>}
			extra={
				<Space>
					<Button icon={<CalendarOutlined />} onClick={() => setCalVisible(true)}>Xem Lịch Tuần</Button>
					<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>Đặt lịch mới</Button>
				</Space>
			}
		>
			<Table columns={columns} dataSource={datLichHen} rowKey="id" bordered />


			<Modal title="ĐĂNG KÝ LỊCH HẸN MỚI" visible={visible} onCancel={() => setVisible(false)} onOk={onHandleOk} width={500}>
				<Form form={form} layout="vertical">
					<Form.Item name="sdt" label="Số điện thoại khách hàng" rules={[{ required: true, message: 'Nhập SĐT' }]}>
						<Input placeholder="09xxx..." />
					</Form.Item>
					<Form.Item name="dichVuId" label="Dịch vụ" rules={[{ required: true }]}>
						<Select placeholder="Chọn dịch vụ">
							{dichVuCaToc.map(d => <Select.Option key={d.id} value={d.id}>{d.tenDichVu} ({d.thoiGianThucHien} phút)</Select.Option>)}
						</Select>
					</Form.Item>
					<Form.Item name="nhanVienId" label="Nhân viên thực hiện" rules={[{ required: true }]}>
						<Select placeholder="Chọn nhân viên">
							{nhanVienThucHien.map(n => <Select.Option key={n.id} value={n.id}>{n.tenNhanVien} (Tối đa {n.gioiHanKhachHang} khách)</Select.Option>)}
						</Select>
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="ngayHen" label="Ngày hẹn" rules={[{ required: true }]}>
								<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="thoiGianBatDau" label="Giờ bắt đầu" rules={[{ required: true }]}>
								<TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} hideDisabledOptions />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			<Modal
				title="Gửi đánh giá dịch vụ"
				visible={rateVisible}
				onCancel={() => setRateVisible(false)}
				onOk={async () => {
					const values = await formRate.validateFields();
					addDanhGiaKhachHang({
						lichHenId: selectedLichHen.id,
						soSao: values.soSao,
						noiDung: values.noiDung,
						phanHoiCuaNhanVien: ''
					});
					message.success('Cảm ơn bạn đã đánh giá!');
					setRateVisible(false);
				}}
			>
				<Form form={formRate} layout="vertical">
					<Form.Item name="soSao" label="Mức độ hài lòng" rules={[{ required: true }]}>
						<Rate />
					</Form.Item>
					<Form.Item name="noiDung" label="Ý kiến của bạn" rules={[{ required: true }]}>
						<TextArea rows={3} placeholder="Dịch vụ rất tốt, nhân viên nhiệt tình..." />
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="BẢNG THEO DÕI LỊCH HẸN THEO TUẦN"
				visible={calVisible}
				onCancel={() => setCalVisible(false)}
				width={1100}
				footer={null}
				bodyStyle={{ padding: '10px 24px 24px 24px' }}
				destroyOnClose
			>
				{renderWeeklyCalendar()}
			</Modal>


			<style>{`
        .ant-modal-body::-webkit-scrollbar { width: 6px; }
        .ant-modal-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
      `}</style>
		</Card>
	);
};

export default QuanLyLichHen;