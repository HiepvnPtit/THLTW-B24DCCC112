import { Button, Card, Image, Rate, Space, Tag, Typography } from 'antd';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { Destination } from '@/services/dulich';
import { tienVietNam } from '@/utils/utils';

const { Paragraph, Text, Title } = Typography;

type DestinationCardProps = {
	destination: Destination;
	selected?: boolean;
	compact?: boolean;
	onAdd?: (destinationId: number) => void;
	footer?: ReactNode;
};

const DestinationCard = ({ destination, selected, compact, onAdd, footer }: DestinationCardProps) => {
	const totalCost = useMemo(
		() => destination.avgCosts.food + destination.avgCosts.stay + destination.avgCosts.transport,
		[destination],
	);

	return (
		<Card
			hoverable
			cover={
				<Image
					alt={destination.name}
					src={destination.imageUrl}
					preview={false}
					style={{ height: compact ? 180 : 200, objectFit: 'cover' }}
				/>
			}
			actions={
				onAdd
					? [
						<Button type='link' icon={<PlusOutlined />} onClick={() => onAdd(destination.id)}>
							{selected ? 'Đã chọn' : 'Thêm vào lịch trình'}
						</Button>,
					]
					: undefined
			}
		>
			<Space direction='vertical' size={8} style={{ width: '100%' }}>
				<Space wrap>
					<Tag color='blue'>{destination.type}</Tag>
					<Tag color='geekblue'>{destination.visitTime} ngày</Tag>
					{selected ? <Tag color='green'>Đã chọn</Tag> : null}
				</Space>
				<Title level={compact ? 5 : 4} style={{ marginBottom: 0 }}>
					{destination.name}
				</Title>
				<Text type='secondary'>
					<EnvironmentOutlined /> {destination.location}
				</Text>
				<Rate disabled allowHalf value={destination.rating} style={{ fontSize: 14 }} />
				<Paragraph ellipsis={{ rows: compact ? 2 : 3 }} style={{ marginBottom: 0 }}>
					{destination.description}
				</Paragraph>
				<Text strong>{tienVietNam(totalCost)}</Text>
				{footer}
			</Space>
		</Card>
	);
};

export default DestinationCard;
