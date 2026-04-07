import { Alert, Button, Card, Col, Input, InputNumber, List, Progress, Row, Select, Space, Statistic, Typography, message } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, SaveOutlined, ClearOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { getBudgetProgress, sortByDestinationCost, type DestinationType } from '@/services/dulich';
import DonutChart from '@/components/Chart/DonutChart';
import DestinationCard from '../components/DestinationCard';
import { tienVietNam } from '@/utils/utils';

const { Title, Text, Paragraph } = Typography;

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

const TaoLichTrinhPage = () => {
    const {
        destinations,
        itineraryDestinations,
        itineraryStops,
        addToItinerary,
        updateItineraryStop,
        deleteItineraryStop,
        moveItineraryStop,
        clearItinerary,
        draftName,
        updateDraftName,
        draftActualCosts,
        updateDraftActualCosts,
        saveCurrentItinerary,
        expectedCosts,
        expectedTotal,
        actualTotal,
        travelMinutesTotal,
        budgetProgress,
    } = useModel('dulich' as any) as any;

    const [keyword, setKeyword] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | DestinationType>('all');
    const [sortMode, setSortMode] = useState<'asc' | 'desc' | 'rating-desc' | 'rating-asc'>('rating-desc');
    const [selectedDay, setSelectedDay] = useState(1);

    const selectedDestinationIds = itineraryStops.map((stop: any) => stop.destinationId);

    const availableDestinations = useMemo(() => {
        return destinations
            .filter((destination: any) => {
                const isKeywordMatch = [destination.name, destination.location, destination.description].join(' ').toLowerCase().includes(keyword.toLowerCase());
                const isTypeMatch = typeFilter === 'all' || destination.type === typeFilter;
                return isKeywordMatch && isTypeMatch && !selectedDestinationIds.includes(destination.id);
            })
            .slice()
            .sort((left: any, right: any) => {
                if (sortMode === 'rating-desc') return right.rating - left.rating;
                if (sortMode === 'rating-asc') return left.rating - right.rating;
                return sortByDestinationCost(left, right, sortMode);
            });
    }, [destinations, keyword, selectedDestinationIds, sortMode, typeFilter]);

    const showBudgetChart = {
        xAxis: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
        yAxis: [[expectedCosts.food || 0, expectedCosts.stay || 0, expectedCosts.transport || 0]],
    };

    const onSavePlan = () => {
        const saved = saveCurrentItinerary();
        if (!saved) {
            message.warning('Chưa có điểm đến nào trong lịch trình');
            return;
        }
        message.success('Đã lưu lịch trình vào lịch sử thống kê');
    };

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
                <Card
                    title={<Title level={4} style={{ margin: 0 }}>Tạo lịch trình</Title>}
                    extra={
                        <Space wrap>
                            <Input
                                value={draftName}
                                onChange={(event) => updateDraftName(event.target.value)}
                                style={{ width: 240 }}
                                placeholder='Tên lịch trình'
                            />
                            <Button icon={<SaveOutlined />} type='primary' onClick={onSavePlan}>
                                Lưu lịch trình
                            </Button>
                            <Button icon={<ClearOutlined />} onClick={() => clearItinerary()}>
                                Xóa toàn bộ
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col xs={24} sm={8}>
                            <Statistic title='Ngân sách dự kiến' value={expectedTotal} formatter={(value) => tienVietNam(Number(value))} />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic title='Chi tiêu thực tế' value={actualTotal} formatter={(value) => tienVietNam(Number(value))} />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic title='Di chuyển' value={travelMinutesTotal} suffix='phút' />
                        </Col>
                    </Row>

                    {budgetProgress.overBudget ? (
                        <Alert
                            type='error'
                            showIcon
                            style={{ marginBottom: 16 }}
                            message='Chi phí thực tế đang vượt ngân sách dự kiến'
                            description={`Thực tế ${tienVietNam(actualTotal)} > dự kiến ${tienVietNam(expectedTotal)}`}
                        />
                    ) : null}

                    <Progress
                        percent={budgetProgress.percent}
                        status={budgetProgress.overBudget ? 'exception' : 'active'}
                        strokeColor={budgetProgress.overBudget ? '#ff4d4f' : '#52c41a'}
                    />

                    <Card title='Phân bổ ngân sách dự kiến' style={{ marginTop: 16 }}>
                        <DonutChart
                            title='Phân bổ ngân sách theo hạng mục'
                            xAxis={showBudgetChart.xAxis}
                            yAxis={showBudgetChart.yAxis}
                            yLabel={['Ngân sách']}
                            showTotal
                            colors={['#1677ff', '#13c2c2', '#faad14']}
                            formatY={(val) => tienVietNam(val)}
                        />
                    </Card>

                    <Card title='Lịch trình đã chọn' style={{ marginTop: 16 }}>
                        <List
                            dataSource={itineraryDestinations}
                            locale={{ emptyText: 'Chưa có điểm đến nào được thêm' }}
                            renderItem={(item: any) => (
                                <List.Item
                                    actions={[
                                        <Button type='link' icon={<ArrowUpOutlined />} onClick={() => moveItineraryStop(item.id, 'up')} />,
                                        <Button type='link' icon={<ArrowDownOutlined />} onClick={() => moveItineraryStop(item.id, 'down')} />,
                                        <Button type='link' danger icon={<DeleteOutlined />} onClick={() => deleteItineraryStop(item.id)} />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={`${item.day} | ${item.order}. ${item.destination?.name}`}
                                        description={
                                            <Space wrap>
                                                <Text type='secondary'>{item.destination?.location}</Text>
                                                <Text type='secondary'>Di chuyển: {item.transitMinutes} phút</Text>
                                                <Text type='secondary'>
                                                    {tienVietNam(
                                                        (item.destination?.avgCosts?.food || 0) +
                                                        (item.destination?.avgCosts?.stay || 0) +
                                                        (item.destination?.avgCosts?.transport || 0),
                                                    )}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                    <Space wrap>
                                        <Select
                                            value={item.day}
                                            style={{ width: 100 }}
                                            onChange={(value) => updateItineraryStop(item.id, { day: Number(value) })}
                                            options={Array.from({ length: 7 }, (_, index) => ({ label: `Ngày ${index + 1}`, value: index + 1 }))}
                                        />
                                        <InputNumber
                                            min={0}
                                            value={item.transitMinutes}
                                            style={{ width: 120 }}
                                            onChange={(value) => updateItineraryStop(item.id, { transitMinutes: Number(value || 0) })}
                                        />
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Card>
            </Col>

            <Col xs={24} xl={10}>
                <Card title='Chọn điểm đến từ danh sách'>
                    <Space wrap style={{ width: '100%', marginBottom: 16 }}>
                        <Input.Search allowClear placeholder='Tìm kiếm điểm đến...' style={{ width: 220 }} onChange={(event) => setKeyword(event.target.value)} />
                        <Select value={typeFilter} options={destinationTypeOptions} style={{ width: 160 }} onChange={setTypeFilter} />
                        <Select value={sortMode} options={sortOptions} style={{ width: 180 }} onChange={setSortMode} />
                        <Select value={selectedDay} style={{ width: 120 }} onChange={setSelectedDay} options={Array.from({ length: 7 }, (_, index) => ({ label: `Ngày ${index + 1}`, value: index + 1 }))} />
                    </Space>
                    <Row gutter={[12, 12]}>
                        {availableDestinations.map((destination: any) => (
                            <Col xs={24} sm={12} xl={24} key={destination.id}>
                                <DestinationCard
                                    compact
                                    destination={destination}
                                    onAdd={(destinationId) => {
                                        addToItinerary(destinationId, selectedDay);
                                        message.success('Đã thêm vào lịch trình');
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card>

                <Card title='Chi tiêu thực tế' style={{ marginTop: 16 }}>
                    <Paragraph type='secondary'>Nhập tổng chi tiêu thực tế để so sánh với ngân sách dự kiến.</Paragraph>
                    <Space direction='vertical' style={{ width: '100%' }} size={12}>
                        <div>
                            <Text>Ăn uống</Text>
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                value={draftActualCosts.food}
                                onChange={(value) => updateDraftActualCosts({ food: Number(value || 0) })}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </div>
                        <div>
                            <Text>Lưu trú</Text>
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                value={draftActualCosts.stay}
                                onChange={(value) => updateDraftActualCosts({ stay: Number(value || 0) })}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </div>
                        <div>
                            <Text>Di chuyển</Text>
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                value={draftActualCosts.transport}
                                onChange={(value) => updateDraftActualCosts({ transport: Number(value || 0) })}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </div>
                    </Space>
                    <Progress
                        style={{ marginTop: 16 }}
                        percent={budgetProgress.percent}
                        status={budgetProgress.overBudget ? 'exception' : 'active'}
                        strokeColor={budgetProgress.overBudget ? '#ff4d4f' : '#1677ff'}
                    />
                    <Text type='secondary'>Tổng thực tế: {tienVietNam(actualTotal)}</Text>
                </Card>
            </Col>
        </Row>
    );
};

export default TaoLichTrinhPage;
