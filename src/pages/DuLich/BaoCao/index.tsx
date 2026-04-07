import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import { Card, Col, Empty, Row, Statistic, Table, Typography } from 'antd';
import { ApartmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useModel } from 'umi';
import { tienVietNam } from '@/utils/utils';

const { Title } = Typography;

const BaoCaoDuLichPage = () => {
	const { travelPlans, monthlyStatistics, popularDestinations, destinations } = useModel('dulich' as any) as any;

	const columnData = useMemo(
		() => ({
			xAxis: monthlyStatistics.map((item: any) => item.month),
			yAxis: [
				monthlyStatistics.map((item: any) => item.itineraryCount),
				monthlyStatistics.map((item: any) => item.expectedBudget),
			],
		}),
		[monthlyStatistics],
	);

	const lineData = useMemo(
		() => ({
			xAxis: monthlyStatistics.map((item: any) => item.month),
			yAxis: [
				monthlyStatistics.map((item: any) => item.expectedBudget),
				monthlyStatistics.map((item: any) => item.actualBudget),
			],
		}),
		[monthlyStatistics],
	);

	const overview = useMemo(() => {
		const totalExpected = travelPlans.reduce(
			(sum: number, plan: any) => sum + ((plan?.expectedCosts?.food || 0) + (plan?.expectedCosts?.stay || 0) + (plan?.expectedCosts?.transport || 0)),
			0,
		);
		const totalActual = travelPlans.reduce(
			(sum: number, plan: any) => sum + ((plan?.actualCosts?.food || 0) + (plan?.actualCosts?.stay || 0) + (plan?.actualCosts?.transport || 0)),
			0,
		);
		return {
			totalPlans: travelPlans.length,
			totalExpected,
			totalActual,
			totalDestinations: destinations.length,
		};
	}, [destinations.length, travelPlans]);

	return (
		<>
			<Title level={4}>Báo cáo du lịch theo tháng</Title>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Lịch trình đã tạo' value={overview.totalPlans} prefix={<TeamOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Tổng ngân sách dự kiến' value={overview.totalExpected} formatter={(value) => tienVietNam(Number(value))} prefix={<DollarOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Tổng chi thực tế' value={overview.totalActual} formatter={(value) => tienVietNam(Number(value))} prefix={<DollarOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Điểm đến' value={overview.totalDestinations} prefix={<ApartmentOutlined />} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} xl={12}>
					<Card title='Số lịch trình và ngân sách theo tháng'>
						{monthlyStatistics.length ? (
							<ColumnChart
								title='So sánh lịch trình và ngân sách theo tháng'
								xAxis={columnData.xAxis}
								yAxis={columnData.yAxis}
								yLabel={['Số lịch trình', 'Ngân sách dự kiến']}
								colors={['#1677ff', '#13c2c2']}
								formatY={(val) => `${Math.round(val)}`}
								otherOptions={{
									legend: { position: 'bottom' },
									plotOptions: { bar: { columnWidth: '45%' } },
								}}
							/>
						) : (
							<Empty description='Chưa có dữ liệu lịch trình' />
						)}
					</Card>
				</Col>
				<Col xs={24} xl={12}>
					<Card title='Ngân sách dự kiến và thực tế theo tháng'>
						{monthlyStatistics.length ? (
							<LineChart
								title='So sánh dự kiến và thực tế'
								xAxis={lineData.xAxis}
								yAxis={lineData.yAxis}
								yLabel={['Dự kiến', 'Thực tế']}
								colors={['#722ed1', '#f5222d']}
								formatY={(val) => tienVietNam(val)}
								otherOptions={{
									stroke: { curve: 'smooth', width: 3 },
									legend: { position: 'bottom' },
								}}
							/>
						) : (
							<Empty description='Chưa có dữ liệu biểu đồ' />
						)}
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} xl={14}>
					<Card title='Điểm đến phổ biến'>
						<Table
							rowKey='destinationId'
							dataSource={popularDestinations}
							pagination={false}
							columns={[
								{ title: 'Điểm đến', dataIndex: 'name' },
								{ title: 'Lượt xuất hiện', dataIndex: 'count', align: 'center' as const },
								{ title: 'Tỷ lệ', render: (_: unknown, record: any) => `${record.count} lần` },
							]}
						/>
					</Card>
				</Col>
				<Col xs={24} xl={10}>
					<Card title='Thống kê tháng gần nhất'>
						<Table
							rowKey='month'
							pagination={false}
							dataSource={monthlyStatistics.slice(-6)}
							columns={[
								{ title: 'Tháng', dataIndex: 'month' },
								{ title: 'Số lịch trình', dataIndex: 'itineraryCount', align: 'center' as const },
								{ title: 'Dự kiến', dataIndex: 'expectedBudget', render: (value: number) => tienVietNam(value) },
								{ title: 'Thực tế', dataIndex: 'actualBudget', render: (value: number) => tienVietNam(value) },
							]}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default BaoCaoDuLichPage;
