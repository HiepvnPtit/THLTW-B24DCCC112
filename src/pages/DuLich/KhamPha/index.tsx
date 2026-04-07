import { Button, Card, Col, Input, Row, Select, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import DestinationCard from '../components/DestinationCard';
import { sortByDestinationCost, type DestinationType } from '@/services/dulich';

const { Paragraph, Title } = Typography;

const destinationTypeOptions = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Biển', value: 'bien' },
	{ label: 'Núi', value: 'nui' },
	{ label: 'Thành phố', value: 'thanh-pho' },
	{ label: 'Văn hóa', value: 'van-hoa' },
	{ label: 'Sinh thái', value: 'sinh-thai' },
];

const sortOptions = [
	{ label: 'Giá thấp → cao', value: 'asc' },
	{ label: 'Giá cao → thấp', value: 'desc' },
	{ label: 'Rating cao → thấp', value: 'rating-desc' },
	{ label: 'Rating thấp → cao', value: 'rating-asc' },
];

const KhamPhaPage = () => {
	const { destinations, addToItinerary } = useModel('dulich' as any) as any;
	const [keyword, setKeyword] = useState('');
	const [typeFilter, setTypeFilter] = useState<'all' | DestinationType>('all');
	const [sortMode, setSortMode] = useState<'asc' | 'desc' | 'rating-desc' | 'rating-asc'>('rating-desc');

	const filteredDestinations = useMemo(() => {
		return destinations
			.filter((destination: any) => {
				const isKeywordMatch = [destination.name, destination.location, destination.description].join(' ').toLowerCase().includes(keyword.toLowerCase());
				const isTypeMatch = typeFilter === 'all' || destination.type === typeFilter;
				return isKeywordMatch && isTypeMatch;
			})
			.slice()
			.sort((left: any, right: any) => {
				if (sortMode === 'rating-desc') return right.rating - left.rating;
				if (sortMode === 'rating-asc') return left.rating - right.rating;
				return sortByDestinationCost(left, right, sortMode);
			});
	}, [destinations, keyword, sortMode, typeFilter]);

	return (
		<Card
			title={<Title level={4} style={{ margin: 0 }}>Khám phá điểm đến</Title>}
			extra={
				<Space wrap>
					<Input.Search
						allowClear
						placeholder='Tìm kiếm tên, địa điểm, mô tả...'
						style={{ width: 280 }}
						onSearch={(value) => setKeyword(value)}
						onChange={(event) => setKeyword(event.target.value)}
					/>
					<Select value={typeFilter} options={destinationTypeOptions} style={{ width: 180 }} onChange={setTypeFilter} />
					<Select value={sortMode} options={sortOptions} style={{ width: 180 }} onChange={setSortMode} />
				</Space>
			}
		>
			<Paragraph type='secondary' style={{ marginTop: -8 }}>
				Lọc theo loại hình, giá và rating để chọn điểm đến phù hợp nhất cho lịch trình của bạn.
			</Paragraph>
			<Row gutter={[16, 16]}>
				{filteredDestinations.map((destination: any) => (
					<Col xs={24} sm={12} lg={8} key={destination.id}>
						<DestinationCard
							destination={destination}
							onAdd={(destinationId) => {
								addToItinerary(destinationId, 1);
								message.success('Đã thêm điểm đến vào lịch trình');
							}}
						/>
					</Col>
				))}
			</Row>
		</Card>
	);
};

export default KhamPhaPage;
