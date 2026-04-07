import { Button, Card, Col, Row, Select, Space, Statistic, Typography } from 'antd';
import { LinkOutlined, RocketOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import './components/style.less';
import DestinationCard from '../DuLich/components/DestinationCard';
import type { DestinationType } from '@/services/dulich';

const { Paragraph, Title } = Typography;

const destinationTypeOptions = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Biển', value: 'bien' },
	{ label: 'Núi', value: 'nui' },
	{ label: 'Thành phố', value: 'thanh-pho' },
	{ label: 'Văn hóa', value: 'van-hoa' },
	{ label: 'Sinh thái', value: 'sinh-thai' },
];

const TrangChu = () => {
	const { featuredDestinations, travelPlans } = useModel('dulich' as any) as any;
	const [typeFilter, setTypeFilter] = useState<'all' | DestinationType>('all');

	const featured = useMemo(() => {
		return (featuredDestinations || []).filter((destination: any) => typeFilter === 'all' || destination.type === typeFilter).slice(0, 4);
	}, [featuredDestinations, typeFilter]);

	return (
		<div className='home-travel-hero'>
			<Card className='hero-card' bodyStyle={{ padding: 24 }}>
				<Row gutter={[24, 24]} align='middle'>
					<Col xs={24} lg={12}>
						<Space direction='vertical' size={16} style={{ width: '100%' }}>
							<Title level={2} style={{ margin: 0 }}>Lập kế hoạch du lịch theo cách trực quan hơn</Title>
							<Paragraph style={{ marginBottom: 0 }}>
								Khám phá điểm đến nổi bật, kéo thả lịch trình, theo dõi ngân sách và nhận cảnh báo vượt mức ngay trong một luồng dữ liệu.
							</Paragraph>
							<Space wrap>
								<Button type='primary' icon={<RocketOutlined />} onClick={() => history.push('/du-lich/kham-pha')}>
									Khám phá ngay
								</Button>
								<Button icon={<LinkOutlined />} onClick={() => history.push('/du-lich/tao-lich-trinh')}>
									Tạo lịch trình
								</Button>
							</Space>
						</Space>
					</Col>
					<Col xs={24} lg={12}>
						<Row gutter={[12, 12]}>
							<Col xs={12} sm={8}>
								<Card>
									<Statistic title='Điểm đến nổi bật' value={featuredDestinations?.length || 0} />
								</Card>
							</Col>
							<Col xs={12} sm={8}>
								<Card>
									<Statistic title='Lịch trình mẫu' value={travelPlans?.length || 0} />
								</Card>
							</Col>
							<Col xs={24} sm={8}>
								<Card>
									<Statistic title='Điều hướng' value='Responsive' />
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
			</Card>

			<Card style={{ marginTop: 16 }} title='Khám phá điểm đến nổi bật' extra={<Select style={{ width: 180 }} options={destinationTypeOptions} value={typeFilter} onChange={setTypeFilter} />}>
				<Row gutter={[16, 16]}>
					{featured.map((destination: any) => (
						<Col xs={24} sm={12} xl={6} key={destination.id}>
							<DestinationCard destination={destination} compact footer={<Paragraph type='secondary' style={{ marginBottom: 0 }}>Chọn từ trang chủ để đưa vào lịch trình</Paragraph>} />
						</Col>
					))}
				</Row>
			</Card>
		</div>
	);
};

export default TrangChu;
