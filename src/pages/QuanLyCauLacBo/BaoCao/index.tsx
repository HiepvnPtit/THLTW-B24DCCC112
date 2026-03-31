import ColumnChart from '@/components/Chart/ColumnChart';
import { Card, Col, Empty, Row, Statistic } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';

const BaoCaoCauLacBoPage = () => {
	const { baoCaoTrangThaiDon, thongKeTongQuan } = useModel('clb' as any) as any;

	const { xAxis, yAxis } = useMemo(() => {
		const ds = baoCaoTrangThaiDon || [];
		return {
			xAxis: ds.map((item: any) => item.tenClb),
			yAxis: [
				ds.map((item: any) => item.pending || 0),
				ds.map((item: any) => item.approved || 0),
				ds.map((item: any) => item.rejected || 0),
			],
		};
	}, [baoCaoTrangThaiDon]);

	return (
		<>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Số CLB' value={thongKeTongQuan?.tongClb || 0} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Pending' value={thongKeTongQuan?.pending || 0} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Approved' value={thongKeTongQuan?.approved || 0} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Rejected' value={thongKeTongQuan?.rejected || 0} valueStyle={{ color: '#f5222d' }} />
					</Card>
				</Col>
			</Row>

			<Card title='Số đơn đăng ký theo từng CLB (Stacked Column)'>
				{xAxis.length ? (
					<ColumnChart
						title='So sánh trạng thái đơn theo từng CLB'
						xAxis={xAxis}
						yAxis={yAxis}
						yLabel={['Pending', 'Approved', 'Rejected']}
						colors={['#faad14', '#52c41a', '#f5222d']}
						formatY={(val) => `${Math.round(val)}`}
						otherOptions={{
							chart: { stacked: true },
							plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
							legend: { position: 'bottom' },
						}}
					/>
				) : (
					<Empty description='Chưa có dữ liệu đơn đăng ký' />
				)}
			</Card>
		</>
	);
};

export default BaoCaoCauLacBoPage;
